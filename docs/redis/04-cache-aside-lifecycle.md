# 04 — Cache-Aside Lifecycle（核心）

## 不变量

- **读**：缓存优先；未命中读**权威源**再回填（带 TTL）。 
- **写**：**先更新权威源**，再 **invalidate**（默认）或更新缓存；**禁止只改缓存不改源**，除非 INPUTS §7 **ephemeral-only**。 
- 缓存是加速层，**不是**业务真相 SSOT（ephemeral-only 除外）。

## 步骤规格（实现自写）

### 读路径（Get）

1. `GET key`（或结构类型等价读）。 
2. **命中** → 反序列化 → 返回（可选：逻辑过期见 `05`）。 
3. **未命中** → 读权威源（PG/API 等，INPUTS §7）。 
4. 源无行 → 按 `05` 穿透策略（默认短 TTL 空值占位或布隆；须选定一种）。 
5. 源有行 → `SET key value EX ttl`（ttl=INPUTS）→ 返回。 
6. 回填竞态：允许多写员覆盖为相同真相；热点见 `05` 单飞。

### 写路径（Mutate）— 非 ephemeral-only

1. **事务/命令更新权威源**至成功提交。 
2. **默认：invalidate** — `DEL`/`UNLINK` 对应缓存键（或键集合）。 
3. **可选：更新缓存** — 仅当 INPUTS 写明选择 write-through 变体；仍须步骤 1 已成功。 
4. 源失败 → **不得**写入或「纠正」缓存为新值冒充已提交。 
5. 失效失败 → 记错误/指标；真相以源为准；可读到短暂旧缓存（TTL 内）— 须在验收可接受或加重试失效。

### 写路径 — ephemeral-only（仅 INPUTS 勾选）

1. 无权威源；直接写 Redis + TTL。 
2. 文档与词表标明「非持久业务真相」。 
3. **不得**把 ephemeral 键当跨服务账本。

### 伪代码（规格级，非实现文件）

```text
get(id):
 v = redis.GET(key(id))
 if v != nil: return decode(v)
 row = source.Get(id) # 权威源
 if row == nil: return miss_policy() # 见 05
 redis.SET(key(id), encode(row), EX=ttl)
 return row

update(id, patch): # 非 ephemeral
 source.Update(id, patch) # 必须先成功
 redis.DEL(key(id)) # 默认失效；禁跳过源只 SET 缓存
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 缓存 miss | 回源；非用户错误 |
| 源错误 | 向上返回；**不**用陈旧策略默默吞（除非 INPUTS 写明 stale-on-error） |
| Redis 不可达（读） | **按 INPUTS §8b**：默认 fail-closed → `STORE_UNAVAILABLE`；仅勾选降级时才直读源。**禁止**规格内「或」双开口 |
| Redis 不可达（写后失效） | 源已成功则业务成功；触发失效重试/告警 |
| 只改缓存请求 | **拒绝**（非 ephemeral）；测试红灯 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 冷读 | 源被调用 1 次；键带 TTL |
| 热读 | 源不被调用 |
| Redis 读不可达（默认） | `STORE_UNAVAILABLE`；源**不被**调用 |
| Redis 读不可达（降级勾选） | 直读源；无冒充缓存健康 |
| 写后读 | 看到源新值（失效后回填）或同一请求内一致 |
| 源更新失败 | 缓存仍为旧或空；**无**「仅缓存新值」 |
| ephemeral-only 未勾却只写缓存 | 门闸/测试失败 |
