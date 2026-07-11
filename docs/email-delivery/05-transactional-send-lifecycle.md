# 05 — Transactional Send Lifecycle（核心）

## 不变量

- 全文唯一核心路径名：**Transactional Send Lifecycle**。 
- 顺序固定：

```text
1 compose template → 2 enqueue/send → 3 provider ack → 4 bounce/complaint handling
```

- **不可跳步、不可调换 1↔2**（未 compose 不得出站）；步骤 4 由异步 Webhook/事件驱动，可晚于 3。 
- **at-least-once**：异步下 submit 可能重复；正确性依赖 [07](./07-idempotency.md)。 
- **provider ack ≠ delivered**：`submitted`/`accepted` 后仍须步骤 4 事件或超时策略（INPUTS 可约定「仅追踪至 accepted」书面裁剪，默认追踪至 delivered/bounced/complained）。

## 步骤规格（实现自写）

### 1. Compose template

1. 按 [03](./03-templates-ssot.md) 校验变量并渲染。 
2. 产出 `ComposedEmail` + 选定 `idempotency_key`。 
3. 失败 → 停；无出站。

### 2. Enqueue / send

1. 抑制检查（[08](./08-bounce-complaint-suppression.md)）。 
2. 按 [04](./04-enqueue-and-send.md)：异步入队或同步准备 submit。 
3. 持久化 `email_messages` 行：`state = queued`（异步）或进入步骤 3（同步）。 
4. 产出稳定 `message_id`（应用侧主键）。

### 3. Provider ack

1. 调用供应商 **submit**（Send API）；请求携带供应商侧幂等头/键（**若**供应商支持；与应用键映射见 `07`）。 
2. 成功响应 → 持久化 `provider_message_id`；状态 → `submitted`（或供应商语义上的 `accepted`，词表只留一个主名，本册默认 **`submitted`**）。 
3. 明确永久拒绝（校验/域名未验证）→ `failed` + `EMAIL_PROVIDER_REJECTED`；**不可**当 delivered。 
4. Transient → 重试（异步走 workers-queue retry；同步按预算）；超限 → `failed` 或 Job dead-letter（异步）。

### 4. Bounce / complaint handling

1. Webhook（或 SNS/轮询，INPUTS 约定）收事件 → **验签**。 
2. 映射到应用 `message_id`（via `provider_message_id`）。 
3. 按 [06](./06-provider-ack-and-delivery-state.md) / [08](./08-bounce-complaint-suppression.md) 推进：`delivered` / `bounced` / `complained` / soft-bounce 重试计数。 
4. hard bounce / complaint → upsert **suppression**；后续发送拒绝。 
5. 重复事件 → 幂等应用（同一转移不双写副作用）。

### 伪代码（规格级）

```text
function sendTransactional(intent):
 composed = compose(intent.template_id, intent.variables) # 1
 if suppressed(intent.to): return EMAIL_SUPPRESSED
 msg = persist_or_enqueue(composed, intent.idempotency_key) # 2
 # async: return msg.id; worker later:
 ack = provider.submit(msg, idempotency_key) # 3
 mark_submitted(msg, ack.provider_message_id)
 return msg.id

# separately:
on_provider_event(raw):
 if not verify_signature(raw): return EMAIL_WEBHOOK_INVALID
 apply_delivery_transition(raw) # 4
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| compose 失败 | 停在步骤 1 |
| 抑制 | 步骤 2 拒绝 |
| provider 永久错 | `failed`；不进 delivered |
| provider 瞬时错 | retry / 不可用错误 |
| Webhook 验签失败 | 4xx；不转移状态 |
| 未知 provider id | 记日志/度量；不 500 打爆（可入死信事件表） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 快乐路径 | 1→2→3；Webhook delivered → `delivered` |
| 跳过 compose 直接 send | 测试/架构红灯 |
| 同键双 submit | 出站有效一次（`07`） |
| hard bounce | state=`bounced` + 抑制行 |
| complaint | state=`complained` + 抑制行 |
| 坏签名 Webhook | 状态不变 |
