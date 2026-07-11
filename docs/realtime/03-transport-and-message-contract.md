# 03 — 传输与消息契约

## 不变量

- 默认传输 **WebSocket**；应用负载 **JSON text**；`v` 必填。  
- 控制面与数据面共用 envelope；`type` 枚举封闭（见下表）。  
- 未知 `type` / 非法 JSON → `PROTOCOL_ERROR` 并关闭或拒绝该帧（INPUTS 钉：默认关闭连接）。

## 步骤规格（实现自写）

1. 服务端暴露单一升级路径（例 `GET /realtime`）；校验 Origin/Cookie/令牌策略（INPUTS §8）。  
2. 升级成功后发可选 `type: "hello"`（含 `conn_id`、`heartbeat_interval_s: 25`）。  
3. 所有后续帧解析为 envelope；校验 [templates/message-envelope.schema.json](./templates/message-envelope.schema.json)。  
4. 按 `type` 分发：`subscribe` / `unsubscribe` / `auth` / `ping` / `pong` / `ack` / `event` / `error`。  
5. 出站业务推送一律 `type: "event"`，带 `channel`、`event_id`、`payload`。  
6. SSE 可选：将同一 `event` 映射为 SSE `data:` 行；`id:` = `event_id`；**不**接受客户端 subscribe 命令帧（改用 query/path 钉死频道，且仍须 authz）。

### Envelope 字段（冻结）

| 字段 | 必填 | 含义 |
|------|------|------|
| `v` | 是 | 协议版本；默认 `1` |
| `type` | 是 | 见枚举 |
| `channel` | 条件 | subscribe/unsubscribe/event 必填 |
| `id` | 条件 | 客户端请求关联 id（subscribe 响应回显） |
| `event_id` | 条件 | 服务端事件唯一 id（投递/ack） |
| `payload` | 条件 | 业务对象；形状由业务词表钉 |
| `error` | 条件 | `{ code, message }` |
| `ts` | 否 | RFC3339；建议事件必带 |

### `type` 枚举（封闭）

`hello` · `auth` · `subscribe` · `unsubscribe` · `subscribed` · `unsubscribed` · `event` · `ack` · `ping` · `pong` · `error`

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| JSON 非法 / 缺 `v`/`type` | `PROTOCOL_ERROR`；默认断开 |
| 未知 `type` | 同上 |
| `v` 不支持 | `PROTOCOL_ERROR`；提示支持版本 |
| 超大帧 | 默认上限 **1 MiB**/帧；超限断开 |
| SSE 却发双向命令 | 规格拒绝；测试红灯 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 合法 subscribe envelope | 进入 authz 步骤 |
| 缺 `channel` 的 subscribe | `PROTOCOL_ERROR` |
| 未知 type | `PROTOCOL_ERROR` |
| event 缺 `event_id` | 拒绝出站（服务端 bug 门闸） |
| 帧 > 1 MiB | 断开 |
