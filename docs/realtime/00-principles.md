# 00 — 原则与不变量

## 品类

用户经**实时通道**订阅业务频道，在授权通过后持续收到推送；客户端与服务端边界清晰；断线可恢复订阅面。

## 核心正确性路径（全文唯一）

**Subscription Lifecycle**：subscribe → authz → 投递 → ack/心跳 → unsubscribe / 断线重连。规格见 [05](./05-subscription-lifecycle.md)。传输细节、Redis 扇出、客户端适配为并列章，**不替代**本路径名。

## 硬不变量

1. **默认传输 = WebSocket**；SSE 仅 INPUTS 书面可选（只读）。**禁** Socket.IO 当默认。  
2. **应用消息 = JSON envelope**（`v` / `type` / `channel` / `id` / …）；字段冻结在词表与 schema。  
3. **Authz 在 subscribe**：连接鉴权 ≠ 频道授权；默认**每次 subscribe** 校验（INPUTS §7）。  
4. **心跳**：应用级或协议级 ping **25s**；**60s** 无应答 → 断开（`HEARTBEAT_TIMEOUT`）。  
5. **重连**：退避 **1s → 30s ×2 ±20% jitter**；恢复后按订阅集 **resubscribe**。  
6. **投递语义**：默认至少一次 + 客户端按 `event_id` 去重；至多一次须 INPUTS 书面。  
7. **背压**：出站队列触顶 → 默认断开 `BACKPRESSURE`（或 INPUTS 书面丢最旧）。  
8. **客户端 / 服务端边界**：服务端拥有 authz、扇出、队列；客户端拥有 UI 订阅意图、去重、重连编排（见 `08`）。  
9. **deletion-first**：无第二套实时协议、无平行「RealtimeManager」包装层当领域主名。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 传输/ACL/心跳数字/扇出勾选 | `INPUTS.md` |
| 目录与业务词表 | `02` + 目标仓 `UBIQUITOUS_LANGUAGE.md` |
| 消息契约 | `03-transport-and-message-contract.md` + templates schema |
| 频道授权 | `04-authz-and-channels.md` |
| Subscription Lifecycle 步骤 | `05-subscription-lifecycle.md` |
| 心跳/重连/背压 | `06-reconnect-heartbeat-backpressure.md` |
| Redis 扇出 | `07` + [redis](../redis/README.md) |
| 客户端消费 | `08-client-consumption.md` |

## 禁止

- 指南仓堆可运行业务聊天/行情模块  
- 「WS 或 SSE 或 Socket.IO 任选」开口  
- 连上即订阅任意私有频道  
- 无 TTL/无上限的无限出站缓冲默许  
- 把 Redis 扇出标成单实例必做  

## 超越（对照写入 11）

1. `对照：B 中更弱/未见「每次 subscribe 必须独立 authz，连接令牌不够」硬门闸 → 本指南要求默认每 subscribe 校验频道 ACL，拒绝则 SUBSCRIBE_REJECTED/FORBIDDEN_CHANNEL（见 04/05）`  
2. `对照：B 中更弱/未见「出站背压上限触顶必须可测失败」硬门闸 → 本指南要求队列 256 条或 1 MiB 先触达者触发默认断开 BACKPRESSURE（见 06）`  
