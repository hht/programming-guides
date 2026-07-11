# 05 — Subscription Lifecycle（核心）

## 不变量

- 全文唯一核心路径：**subscribe → authz → 投递 → ack/心跳 → unsubscribe / 断线重连**。 
- 任一步失败不得「静默半订阅」：要么 `subscribed` 且可投递，要么明确错误码且 hub 无记录。 
- 心跳与重连数字见 `06`；本章引用默认值，不另开口。

## 步骤规格（实现自写）

### 1. Subscribe（客户端意图 → 服务端请求）

1. 客户端在 `connected` 后发送：
 ```text
 { "v":1, "type":"subscribe", "id":"<client_req_id>", "channel":"<channel>" }
 ```
2. 服务端校验 envelope（`03`）；非法则 `PROTOCOL_ERROR` 并**停止**本路径。 
3. 进入步骤 2（authz）；**禁止**先加入 hub 再鉴权。

### 2. Authz（频道授权）

1. 执行 `04` 全套：模式 → ACL → 主体 → 谓词。 
2. 拒绝：回 `{ type:"error", id, error:{ code } }`；**不**登记订阅；结束本路径。 
3. 允许：登记 `conn_id × channel`；回 `{ type:"subscribed", id, channel }`。

### 3. 投递（Deliver）

1. 业务侧产生事实后调用发布端口：`publish(channel, payload) -> event_id`。 
2. Hub（或 Redis 扇出后的本地订阅者，见 `07`）扇出到所有已订阅连接。 
3. 每连接出站：
 ```text
 { "v":1, "type":"event", "channel", "event_id", "payload", "ts" }
 ```
4. 出队前检查背压（`06`）；触顶按 INPUTS。 
5. **至少一次（默认）**：允许重连后重放未 ack 缓冲（若实现缓冲）；客户端按 `event_id` 去重。

### 4. Ack / 心跳

1. **Ack（默认）**：客户端对需确认的事件回：
 ```text
 { "v":1, "type":"ack", "event_id" }
 ```
 服务端可丢弃重放缓冲条目；无缓冲实现时 ack 仍须接受（幂等空操作）。 
2. **心跳**：任一方按 **25s** 发 `ping`；对端 **pong**；**60s** 无成功往返 → 断开 `HEARTBEAT_TIMEOUT`（详见 `06`）。 
3. 心跳失败视为连接死亡 → 进入步骤 5b。

### 5a. Unsubscribe（显式）

1. 客户端：`{ type:"unsubscribe", id, channel }`。 
2. 服务端移除 `conn_id × channel`；回 `unsubscribed`。 
3. 后续 `publish` 不再投递该连接。

### 5b. 断线重连（隐式结束 + 恢复）

1. 连接关闭（网络/心跳/背压/服务器重启）→ 服务端**立即**清除该 `conn_id` 全部订阅。 
2. 客户端按 `06` 退避重连 → 再 auth（若需）→ 对**上次成功订阅集**逐个 `subscribe`（步骤 1–2）。 
3. 恢复完成前 UI 不得假装仍 `subscribed`（见 `08`）。

### 伪代码（规格级，非实现文件）

```text
on_subscribe(conn, req):
 if !valid_envelope(req): return error(PROTOCOL_ERROR); close?
 if !authorize_subscribe(conn.subject, req.channel):
 return error(AUTH_REQUIRED|FORBIDDEN_CHANNEL|SUBSCRIBE_REJECTED)
 hub.add(conn, req.channel)
 return subscribed(req.id, req.channel)

publish(channel, payload):
 eid = new_event_id()
 for conn in hub.subscribers(channel): # 或经 Redis 到各节点再查本地
 if !conn.enqueue(event(channel, eid, payload)):
 conn.close(BACKPRESSURE)

on_disconnect(conn):
 hub.remove_all(conn)
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| authz 拒绝 | 错误码；无订阅 |
| 投递时连接已断 | 跳过该连接；不回滚业务事实 |
| ack 未知 event_id | 忽略（幂等） |
| 重复 subscribe 同频道 | 幂等成功；仍回 `subscribed` |
| 重连未 resubscribe | **无**推送；测试红灯（客户端契约） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 合法全路径 | subscribed → 收 event → ack 可空操作成功 |
| authz 失败 | 无 hub 记录；无 event |
| unsubscribe | 之后 publish 不可达该连接 |
| 断线 | hub 清空该 conn |
| 重连 + resubscribe | 再次收到新 event |
| 先 hub 后 authz（反例实现） | 门闸/审查失败 |
