# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：随宿主应用册 Language Gate（本册不另开语言百科；实现语言的 fmt/lint 跟宿主 `commands`）。

## 品类

用户经实时通道订阅业务频道；授权通过后持续推送；断线可恢复订阅面。

## 核心正确性路径（全文唯一）

**Subscription Lifecycle**：subscribe → authz → 投递 → ack/心跳 → unsubscribe/重连。规格见 [05](./05-subscription-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 默认传输=WebSocket | `01`/`03` |
| F02 | MUST NOT | Socket.IO 当默认 | 同上 |
| F03 | MUST | 应用消息=JSON envelope；字段冻结 | `03` |
| F04 | MUST | 每次 subscribe 校验频道授权 | `04` |
| F05 | MUST | 心跳 25s；60s 无应答断开 | `06` |
| F06 | MUST | 重连退避后按订阅集 resubscribe | `06` |
| F07 | MUST | 默认至少一次 + event_id 去重 | INPUTS/`05` |
| F08 | MUST | 背压触顶默认断开 BACKPRESSURE | `06` |
| F09 | MUST | deletion-first | 目录 |

## SSOT

| 真相 | Owner |
|------|--------|
| 传输/ACL/心跳/扇出 | `INPUTS.md` |
| 消息契约 | `03` + templates |
| 频道授权 | `04` |
| Lifecycle | `05` |
| 心跳/重连/背压 | `06` |
| Redis 扇出 | `07` + redis |
| 客户端消费 | `08` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md` |
