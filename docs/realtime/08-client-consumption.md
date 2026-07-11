# 08 — 客户端消费

## 不变量

- 客户端拥有：**订阅意图集**、**连接状态机**、**event_id 去重**、**重连编排**。  
- 服务端拥有：**authz**、**hub/扇出**、**背压**。  
- UI **禁止**在 `connected` 但未 `subscribed` 时展示「实时已同步」类成功态。  
- 默认浏览器 API：`WebSocket`；SSE 可选 `EventSource`。**禁**默认 Socket.IO client。

## 步骤规格（实现自写）

### 状态机

```text
disconnected → connecting → connected → subscribed(≥1 channel)
 any → error → (退避) connecting
 unsubscribe 最后一条 → connected（仍可再订）
```

1. 打开 `REALTIME_WS_URL`；`onopen` → `connected`。  
2. 若需首帧 `auth`：发送后等待成功再 subscribe。  
3. 对意图集每条 channel 调 `subscribe`；全部成功 → 可标业务「订阅就绪」。  
4. `onmessage`：解析 envelope；`event` → 去重表（LRU，默认保留 **1024** 个 `event_id`）→ 交给 `features/<业务>`。  
5. `ack`：对需确认事件回发（INPUTS §15）。  
6. `onclose`/`error` → 清本地「已订阅」标记 → `06` 重连 → resubscribe 意图集。  
7. 页面卸载：`unsubscribe` 最佳努力 + `close`。

### SSE 变体（可选）

1. `EventSource(REALTIME_SSE_URL + 钉死 query)`；带 Cookie 或网关注入鉴权。  
2. `Last-Event-ID` 对齐 `event_id` 续传（若服务端支持）。  
3. **无**客户端 subscribe 帧；频道变更 / 取消订阅 = **关流**（`EventSource.close`）或 **换流**（关旧开新）；与 sources/11§B「取消订阅」共有行等价，**不得** N/A。  
4. 状态机仍须区分 connecting/connected/error；「subscribed」= 流已打开且 authz 未 403。

### 与 UI

| UI 态 | 条件 |
|-------|------|
| 离线提示 | `disconnected`/`connecting` |
| 实时指示 | 至少一频道 `subscribed` |
| 错误 toast | `FORBIDDEN_CHANNEL` / `AUTH_REQUIRED` 等可映射文案 |

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 重复 event_id | 丢弃；不重复渲染 |
| subscribe 部分失败 | 失败频道 error；成功频道可收 |
| Token 过期 | 走 auth 刷新或全页登录；禁死循环重连无刷新 |
| 多 tab | 每 tab 独立连接；或 INPUTS 书面 SharedWorker（非默认） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 去重 | 同 event_id 业务处理 1 次 |
| 重连 | 意图集全部 resubscribe |
| 未 subscribed 成功态 | UI 门闸失败 |
| SSE 403 | error 态；不假装 connected 业务就绪 |
