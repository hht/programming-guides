# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写 realtime 实现**。 
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL/频道表/P0）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **能力组合（至少勾一）** | □ **WebSocket 订阅推送（默认主路径）** □ **SSE 只读推送（可选）** □ **多实例 Redis 扇出（可选）** — 主路径永远是 Subscription Lifecycle；仅 SSE 时 `05` 步骤仍适用（无 WS 帧，改用 EventSource 流） |
| 2 | **传输写明** | **默认 WebSocket**。若勾 SSE：须写明理由（只读、穿透代理、无双向）+ 与 WS 能力边界表。**禁止**「WS 或 SSE 任选」双默认 |
| 3 | **应用册服务端** | □ **go**（默认库 **`github.com/coder/websocket`**）□ fastapi □ node/ts □ 多册（列清单）— 步骤按 `05` 语言无关；**禁止**同册第二默认 WS 库开口 |
| 4 | **WS 入口 URL 名** | staging/prod **成对**；变量名须写明（默认 `REALTIME_WS_URL`）；**值不入库** |
| 5 | **消息 envelope 版本** | 默认 **`v: 1`**；JSON Schema 对齐 [templates/message-envelope.schema.json](./templates/message-envelope.schema.json)；字段改名=契约变更 |
| 6 | **频道命名表** | 业务频道模式写明（例 `order:{order_id}`、`user:{subject}:inbox`）；禁空频道、禁 `*` 裸通配进生产 ACL |
| 7 | **Authz 策略** | **互斥任选其一**：□ **每 subscribe 校验**（**默认**；连接鉴权不够）□ **连接时签发频道 claim 列表**（须写明：claim TTL、扩频道须重连）— **禁止**「连上就能订任意频道」 |
| 8 | **会话/令牌来源** | 对齐 [auth](../auth/README.md) 或产品 JWT：Cookie / `Authorization` / 首帧 `auth` 消息 — **互斥任选其一**；值不入库 |
| 9 | **错误码表** | 至少：`AUTH_REQUIRED` / `FORBIDDEN_CHANNEL` / `SUBSCRIBE_REJECTED` / `BACKPRESSURE` / `PROTOCOL_ERROR` / `HEARTBEAT_TIMEOUT` / `STORE_UNAVAILABLE` → 应用映射（`STORE_UNAVAILABLE` = Redis/存储不可达时发布 fail-closed；见 `07`） |
| 10 | **心跳数字** | 默认 **ping 间隔 25s**、**超时 60s**（未收 pong/应用级心跳则断开）；改写须写明 |
| 11 | **重连数字** | 默认初始 **1s**、上限 **30s**、乘数 **2**、**±20% jitter**；重订：断线后按上次成功订阅集 **自动 resubscribe**（须勾是否保留） |
| 12 | **环境成对** | staging/prod：`APP_ENV`、`REALTIME_WS_URL`、（若 SSE）`REALTIME_SSE_URL`、（若 Redis 扇出）`REDIS_URL`；值不入库 |
| 13 | **应用册对接** | □ go □ fastapi □ nextjs □ react □ 多册 — 本册为实时订阅生命周期 SSOT |

## 若适用

| # | 项 | 何时 |
|---|-----|------|
| 14 | **SSE 路径** | 勾了 SSE：只读；事件名/id/`Last-Event-ID` 策略须写明；取消订阅 = **关流/换流**（与 11§B 共有行等价，**禁** N/A）；**不得**用 SSE 做默认双向命令通道 |
| 15 | **Ack 策略** | **互斥任选其一**：□ **至少一次 + 客户端去重（event_id）**（**默认**）□ **至多一次（服务端持久游标）**（须写明存储） |
| 16 | **背压** | 每连接出站队列上限默认 **256** 条或 **1 MiB**（先触达者触发）；超限行为写明：□ 断开并 `BACKPRESSURE`（**默认**）□ 丢弃最旧并记指标（须写明） |
| 17 | **Redis 扇出** | 勾了多实例：对齐 [redis](../redis/README.md) INPUTS（`REDIS_URL`、前缀、TTL 若用键）；频道 → Redis channel 映射表；**单实例可 N/A** |
| 18 | **Socket.IO 映射** | 仅当遗留对接：书面「学边界不作默认」；新仓 **禁止** 以 Socket.IO 为默认传输 |
| 19 | **公开 vs 私有频道** | ACL 表：公开只读列表 + 私有须 authz；见 [templates/channel-acl.schema.json](./templates/channel-acl.schema.json) |
| 20 | **令牌过期行为** | **默认**（见 `04`）：主动 `error` + 断开。若需连接内续订或「仅下次 subscribe 才拒」：须本行书面另路径 + 可验收谓词；**禁止**「默认主动断开 **或** 等到下次 subscribe」开口 |

## 能力裁剪

| 勾选能力 | 必读章 | 可 N/A |
|----------|--------|--------|
| 仅 WS 订阅 | 03–06、08 | 07（未勾 Redis）；SSE 节 |
| WS + Redis 扇出 | 03–08 | SSE 节 |
| 仅 SSE 只读 | 03–06、08（SSE 变体） | 07；双向命令 |
| WS + SSE | 03–08 按项 | 未勾 Redis → 07 N/A |
| 全开 | 03–08 | — |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
