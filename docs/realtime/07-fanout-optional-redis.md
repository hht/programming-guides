# 07 — 扇出 / 可选 Redis

## 不变量

- **单实例默认**：进程内 hub 即可；**不**强制 Redis。 
- **多实例**：INPUTS 勾选后用 **Redis pub/sub** 做跨节点扇出；键/URL/客户端对齐 [redis](../redis/README.md)。 
- Redis 通道上的消息仍须回到本节点后走 **本地订阅表 + `05` 投递**；**禁**绕过 authz 直接对任意连接灌流。 
- Redis 不可达：新发布 **fail-closed**（返回 INPUTS §9 码 **`STORE_UNAVAILABLE`**）；已建立的本地订阅可继续本地投递直至进程策略须写明（默认：发布失败向上报错）。

## 步骤规格（实现自写）

### 单实例（默认）

1. `publish(channel, payload)` → 查本地 hub → `enqueue` 各连接。 
2. 无 Redis 调用。

### 多实例（INPUTS 勾选）

1. 定义映射：`realtime_channel → redis_pubsub_channel`（例 `acme:rt:{channel}`；前缀来自 redis INPUTS）。 
2. 每个节点订阅（PSUBSCRIBE/SUBSCRIBE）自己的模式；**进程启动时**建立，崩溃再连（对齐 redis 读不可达策略：扇出场景默认 fail-closed 发布）。 
3. `publish`： 
 - 生成 `event_id`； 
 - `PUBLISH redis_channel encode(envelope)`； 
 - **本节点可不短路**（或短路本地 + 仍 PUBLISH，须防双投：默认 **只 PUBLISH，由订阅回调统一投递**，含本节点）。 
4. 收 Redis 消息 → 解码 → **仅**投递给本机 hub 中已 authz 的连接。 
5. **禁止**在 Redis 消息里信任客户端伪造的 `subject` 扩权；authz 只在 subscribe 时做一次并保存在本地订阅表。

### 与 redis 册对齐

| 项 | 要求 |
|----|------|
| 引擎 | Redis ≥7 |
| 客户端 | go-redis / ioredis / redis-py（按应用册） |
| 键/频道前缀 | 业务前缀；登记在 redis 键/频道表 |
| 会话 | 本册不把 Redis session 当默认；鉴权仍对齐 auth |

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 未勾 Redis 却多副本 | **规格违规**；验收红灯 |
| PUBLISH 失败 / Redis 不可达 | 返回 **`STORE_UNAVAILABLE`**（INPUTS §9）；不假装已达全网 |
| 重复投递（重连+pubsub） | 客户端 `event_id` 去重 |
| Redis 订阅断开 | 重连订阅；期间漏消息按至少一次+业务补偿（INPUTS 可约定游标） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 单实例 publish | 本地订阅者收到 1 次 |
| 双节点（测） | 节点 B 订阅者收到 A 发布 |
| 未订阅者 | 不收 |
| Redis down 发布 | `STORE_UNAVAILABLE`；非静默成功 |
| 绕过 hub 直推（反例） | 禁止；审查失败 |
