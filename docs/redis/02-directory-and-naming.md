# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
# 实现仓建议落点（按应用册微调；词根不变）
internal/redis/ # 或 src/shared/redis/ — 连接与命令封装（基础设施名允许）
features/<capability>/ # 业务能力：cache / lock / rate-limit / session（按 INPUTS）
 <entity>/ # 例 orders/ — 键与 Cache-Aside 调用落在此
ops/
 redis.md # 可选：容量/驱逐说明（非第三方 APM 必勾）
compose.yaml # 含 redis 服务（templates 例）
```

依赖方向：`features/<业务> → redis 客户端封装 → Redis`；**禁** UI/handler 直接拼无前缀裸键。 
键名约定 SSOT：本册 `03` + 目标仓词表；禁第二份「cache key utils」分叉。

UI 状态矩阵：本品类默认 **N/A**（基础设施；会话 Cookie UI 见 auth）。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建或更新 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。 
2. **键中的实体段、锁资源名、限流桶名** = 业务实体/操作词根（`order`、`checkout`），禁 `data`、`tmp`、`obj`、`manager`。 
3. **禁**技术翻译名进领域模块主名：`*CacheManager`、`*RedisHelper`、`handleCache*`（基础设施连接层可用 `RedisClient` 等例外，见 meta）。 
4. **禁**同义词分叉：`invalidate`/`evict`/`bust` 词表只留一个（本册默认 **`invalidate`**）。 
5. 对外若暴露限流错误码，字段名冻结在词表。

| 概念 | 正例 | 反例 |
|------|------|------|
| 缓存键实体 | `order`、`product` | `entity`、`row`、`obj` |
| 锁资源 | `checkout:{order_id}` | `lock1`、`mutex_data` |
| 限流桶 | `rl:login:{ip}` | `bucket_tmp`、`rate_helper` |
| 操作名 | `getOrder`、`invalidateOrder` | `handleCache`、`processRedis` |
| 会话（若 Redis） | 对齐 auth：`session`、`token_hash`、`subject` | `sess_blob`、`userTokenPlain` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| Redis 键 | `{prefix}{entity}:{id}` 或 `{prefix}{entity}:{id}:{attr}`；段用 `:`；prefix 以 `:` 结尾（例 `acme:`） |
| 锁键 | `{prefix}lock:{resource}` |
| 限流键 | `{prefix}rl:{bucket}:{window_id}`（固定窗口） |
| 会话键 | `{prefix}session:{token_hash}`（或 auth 写明形状） |
| Go 导出 | `PascalCase`；TS/Python 跟应用册 |
| 环境变量 | `REDIS_URL`、`SESSION_SECRET`（若会话） |
