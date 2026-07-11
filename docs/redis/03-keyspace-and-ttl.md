# 03 — 键空间与 TTL

## 不变量

- 生产业务键：**有前缀、有实体、有 id（或桶维度）、有 TTL 策略**。 
- 前缀 = INPUTS §5；改前缀 = 契约变更（须迁移/双读计划，本册不默认双写）。 
- **禁止**默认「永不过期」业务键；监控/调试键若无 TTL 须写明且非热路径。

## 步骤规格（实现自写）

1. **登记键模式** 
 - 每类键写入实现仓表（可对齐 [templates/key-patterns.schema.json](./templates/key-patterns.schema.json)）：`pattern`、`purpose`、`ttl_seconds`、`owner_feature`。 
2. **拼键** 
 - `key = prefix + entity + ":" + id`（多段属性继续 `:`）；禁止用户输入直接当整键（须校验/转义分隔约定）。 
3. **写入必带过期** 
 - `SET`/`HSET` 等写路径同时 `EXPIRE`/`SET EX`/`SETEX`；或 pipeline 原子保证。 
 - TTL 取自 INPUTS §6 该类默认值；允许抖动见 `05` 雪崩节。 
4. **读取** 
 - 未命中 ≠ 错误；命中后仍须按业务校验（脏读窗口见 `04`）。 
5. **删除 / 失效** 
 - 业务失效用 `DEL`/`UNLINK` **针对缓存数据键**；**锁键删除走 `06` token 路径**，不得与本条混用。 
6. **DB index** 
 - 默认 `0`；分 DB 不替代前缀治理。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 键无 TTL（违规） | CI/探针失败；禁止合并 |
| `REDIS_URL` 缺失 | 启动非 0 |
| 前缀为空（生产） | 启动非 0 |
| 键过长 / 非法字符 | 校验失败 → 应用 validation 错误 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| SET 业务缓存键 | `TTL` > 0 |
| 键含 prefix+entity+id | 匹配 INPUTS 模式 |
| 无 REDIS_URL 启动 | exit ≠ 0 |
