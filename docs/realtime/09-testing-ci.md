# 09 — 测试与 CI

指南**不附**可运行测试源码；实现仓按表自写。

## 单测探针（case → 期望）

| # | case | 期望 | 适用 |
|---|------|------|------|
| 1 | 合法 subscribe | `subscribed`；hub 有记录 | WS |
| 2 | 私有频道匿名 | `AUTH_REQUIRED`；无 hub | WS |
| 3 | 无权限主体 | `FORBIDDEN_CHANNEL` | WS |
| 4 | publish 后投递 | 订阅者收 `event`+`event_id` | WS |
| 5 | unsubscribe | 之后无投递 | WS |
| 6 | 断线清订阅 | hub 无该 conn | WS |
| 7 | 非法 envelope | `PROTOCOL_ERROR` | WS |
| 8 | ping 抑制 | ≤60s 断开 | WS |
| 9 | 灌满队列 | `BACKPRESSURE` | WS |
| 10 | 客户端去重 | 同 event_id 处理 1 次 | 客户端 |
| 11 | 重连 resubscribe | 再收新事件 | 客户端 |
| 12 | Redis 跨节点 | B 收到 A 发布 | 勾 Redis |
| 13 | Redis down 发布 | 非静默成功 | 勾 Redis |
| 14 | SSE 只读 + 鉴权 | 未授权 401/403 | 勾 SSE |
| 15 | 无 `REALTIME_WS_URL` | 启动非 0（若启用 WS） | WS |

## 发版场景 × 断言矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | staging WS upgrade | 101/连接成功 + hello 或首帧合法 |
| 2 | Subscription Lifecycle | 单测 1–6 |
| 3 | 心跳/背压 | 单测 8–9 |
| 4 | 客户端重连去重 | 单测 10–11 |
| 5 | Redis 扇出（若启用） | 单测 12–13 |
| 6 | SSE（若启用） | 单测 14 |
| 7 | `check` | exit 0 |

PR：`check`。发版：同 + 矩阵适用行。
