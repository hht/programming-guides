# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| MDN WebSocket API | https://developer.mozilla.org/en-US/docs/Web/API/WebSocket |
| RFC 6455 The WebSocket Protocol | https://datatracker.ietf.org/doc/html/rfc6455 |
| WHATWG HTML — Server-sent events（SSE 可选路径） | https://html.spec.whatwg.org/multipage/server-sent-events.html |

## 标杆 B（开源应用/引擎面 P1）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [centrifugal/centrifugo](https://github.com/centrifugal/centrifugo) | P1 | 频道订阅、连接令牌、服务端扇出边界 | 绑死 Centrifugo 二进制当唯一部署；抄其全配置方言 | 用户订频道收实时推送 |
| B | [discourse/discourse](https://github.com/discourse/discourse) | P1 | 产品侧 MessageBus/实时通知与会话边界 | 抄 Rails/整站；把 MessageBus 当本册默认协议 | 论坛用户收帖子/通知实时更新 |
| C | [mastodon/mastodon](https://github.com/mastodon/mastodon) | P1 | Streaming（含 SSE）时间线推送与鉴权边界 | 抄联邦协议；把 SSE 抬成双向默认 | 社交用户订阅时间线流 |

**学边界不钉默认（非 B 计数）：** [socketio/socket.io](https://github.com/socketio/socket.io) — 房间/ack/重连语义可映射到本册步骤；**禁止**新仓默认依赖 Socket.IO。

引擎/库事实：P0 MDN/RFC +（实现时）`coder/websocket`；**不**单独充当「用户任务」共有证据源。

## 共有能力切条（用户可感知）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 订阅频道/主题并持续收推送 | ✓ | ✓ | ✓ | **必做** |
| 私有流/频道须登录或令牌后才可见 | ✓ | ✓ | ✓ | **必做** |
| 断线后恢复实时面（重连/重订） | ✓ | ✓/可映射 | ✓/可映射 | **必做** |
| 心跳或等价保活（用户感知：连接保持） | ✓ | ✓/可映射 | ✓/可映射 | **必做**（工程数字进 §A/`06`） |
| 取消订阅 / 离开频道 | ✓ | ✓/可映射 | ✓/可映射 | **必做**（SSE 映射：关流/换流；11§B **禁** N/A） |
| 多节点扇出 | ✓ | 可 | 可 | **可选**（勾 Redis） |
| SSE 只读流 | — | — | ✓ | **可选**（INPUTS；≥1 源 → 非共有必做） |
| Socket.IO 专有协议 | — | — | — | **参考**（学映射） |

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做 |
|------|------|------|------|------|
| Subscription Lifecycle 编号步骤 | A,B,C | 功能 | `05` | 必做 |
| 每 subscribe authz（非仅握手） | A,C + 超越 | 安全 | `04`/`05` | 必做/超越 |
| JSON envelope + 错误码 | 工程 | 工程 | `03` | 必做 |
| 心跳/重连钉死数字 | A + P0 | 工程 | `06` | 必做 |
| 背压上限 | 工程/超越 | 工程 | `06` | 必做/超越 |
| Redis 扇出可选 | A + redis 册 | 功能 | `07` | 条件必做 |
| 客户端消费边界 | B,C | 功能 | `08` | 必做 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| Socket.IO 流行 → 当默认传输 | **否**；默认裸 WebSocket + JSON envelope；Socket.IO 仅学映射 |
| gorilla/websocket 星数更高 | **否**；默认 **`github.com/coder/websocket`**（context/取消语义更清晰；原 nhooyr 线） |
| SSE vs WebSocket 双默认 | **否**；默认 **WebSocket**；SSE = INPUTS 书面可选只读路径 |
| 自建协议 vs Centrifugo 托管 | 指南钉**自写步骤**；可用 Centrifugo 作对照标杆，不强制其二进制为默认运行时 |
| Redis 扇出 vs 单进程 | 单实例默认进程内 hub；多实例须 INPUTS 勾 Redis 并对齐 [redis](../redis/README.md) |
