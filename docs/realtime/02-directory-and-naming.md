# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
# 实现仓建议落点（按应用册微调；词根不变）
internal/realtime/ # 或 src/shared/realtime/ — 连接升级、hub、心跳（基础设施名允许）
features/<capability>/ # 业务能力：例 orders/inbox/presence
 <entity>/
 subscription.ts|.go # 订阅意图与频道名（业务词）
ops/
 realtime.md # 可选：连接数/背压说明（非第三方 APM 必勾）
```

依赖方向：`features/<业务> → realtime 连接层 → 传输`；**禁** UI 直接拼无 ACL 的裸频道字符串散落多处（频道模式集中词表 + `04`）。 
消息字段 SSOT：`03` + schema；禁第二份「socket payload utils」分叉。

UI 状态（客户端）：至少区分 `disconnected` / `connecting` / `connected` / `subscribed` / `error`（见 `08`）；矩阵写入实现仓或本册验收勾选。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建或更新 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。 
2. **频道名、事件名、订阅操作** = 业务实体/操作词根（`order`、`inbox`、`subscribeOrder`），禁 `data`、`tmp`、`room1`、`manager`。 
3. **禁**技术翻译名进领域模块主名：`*RealtimeManager`、`*SocketHelper`、`handleMessage*`、`*Dto`（基础设施连接层可用 `RealtimeHub` / `WebSocketConn` 等例外，见 meta）。 
4. **禁**同义词分叉：`subscribe`/`join`/`listen` 词表只留一个（本册默认 **`subscribe`** / **`unsubscribe`**）；`event`/`message`/`push` 对外协议字段只留词表所约定（默认 envelope `type: "event"`）。 
5. 对外协议字段名冻结在词表；改名=契约变更。

| 概念 | 正例 | 反例 |
|------|------|------|
| 频道 | `order:{order_id}`、`user:{subject}:inbox` | `chan1`、`room_tmp`、`data_stream` |
| 操作 | `subscribe`、`unsubscribe`、`publishOrderEvent` | `handleSock`、`processFrame`、`doJoin` |
| 事件 | `order.updated`、`inbox.item_added` | `msg`、`payload_type_3` |
| 连接态 | `connected`、`subscribed` | `wsReady`、`sockOk` |
| 错误 | `FORBIDDEN_CHANNEL`、`BACKPRESSURE` | `ERR_MANAGER`、`fail_helper` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| 频道 | `{entity}:{id}` 或 `{entity}:{id}:{facet}`；段用 `:`；禁空段 |
| envelope 字段 | `snake_case` JSON 键（`event_id`、`channel`）— 与 schema 一致 |
| Go 导出 | `PascalCase`；TS/Python 跟应用册 |
| 环境变量 | `REALTIME_WS_URL`、`REALTIME_SSE_URL`（若 SSE）、`REDIS_URL`（若扇出） |
| 错误码 | `SCREAMING_SNAKE` |
