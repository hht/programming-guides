# Realtime — WebSocket / SSE / 订阅推送指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **实时订阅通道**（连接、鉴权频道、投递、心跳、断线重连；可选 SSE / Redis 扇出）。  
> **默认栈**：**WebSocket** + 应用消息 **JSON envelope** + 服务端 **Go + `github.com/coder/websocket`**（步骤语言无关，可映射 FastAPI/Node）+ 心跳 **25s** / 超时 **60s** / 重连退避 **1s→30s ±20% jitter**；**禁** Socket.IO 当默认；SSE / Redis pub/sub = INPUTS 可选。  
> **来源**：[sources.md](./sources.md)

## 品类一句话

用户经**实时通道**订阅业务频道，在授权通过后持续收到推送；客户端与服务端边界清晰；断线可恢复订阅面。

## 核心正确性路径

**Subscription Lifecycle**（[05](./05-subscription-lifecycle.md)）：subscribe → authz → 投递 → ack/心跳 → unsubscribe / 断线重连。全文唯一主路径名。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；按「能力裁剪」只读必读章  
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`）  
3. 必读 [03](./03-transport-and-message-contract.md) + [04](./04-authz-and-channels.md) + [05](./05-subscription-lifecycle.md)；按 INPUTS 落地 [06](./06-reconnect-heartbeat-backpressure.md) / [07](./07-fanout-optional-redis.md) / [08](./08-client-consumption.md)  
4. [commands.md](./commands.md) `check` 绿  
5. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者）  

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；传输/扇出裁剪 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-transport-and-message-contract.md) | 传输与消息契约 |
| [04](./04-authz-and-channels.md) | 频道与授权 |
| [05](./05-subscription-lifecycle.md) | **Subscription Lifecycle** |
| [06](./06-reconnect-heartbeat-backpressure.md) | 心跳 / 重连 / 背压 |
| [07](./07-fanout-optional-redis.md) | 可选 Redis 扇出（对齐 redis） |
| [08](./08-client-consumption.md) | 客户端消费边界 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | schema / env / snippet 例 |
