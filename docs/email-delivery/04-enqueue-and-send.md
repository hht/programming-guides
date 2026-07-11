# 04 — 入队 / 发送与事务边界

## 不变量

- **发送路径互斥**：INPUTS §6 钉死 **异步队列（推荐）** 或 **同步直发**。  
- 异步：**业务写与 outbox/enqueue 同事务**（默认；对齐 [workers-queue/04](../workers-queue/04-enqueue.md)）；禁止「业务已提交、邮件意图丢失且无补偿」。  
- 进入本步前必须已 **compose 成功**；且通过抑制检查（`08`）。  
- **幂等键**在持久化发送意图时写入；无键拒绝。

## 步骤规格（实现自写）

### A. 异步队列（推荐）

1. 在业务事务内插入 `email_messages`：`state = queued`（或 `composed`→立刻 `queued`），payload = composed 快照或「template_id+variables」二选一（**默认存 composed 快照**，避免模板升版竞态；INPUTS 可改存引用并钉风险）。  
2. `enqueue` Job：`queue_name = email.send`（例），`idempotency_key` = 本发送意图键，payload 含 `message_id`。  
3. Worker claim 后：抑制复查 → `submit` provider（`05` 步骤 3）→ 写 `submitted` + provider id。  
4. 认领/重试/死信 **不**在本册重定义 → 见 workers-queue `05`–`08`；本册只要求 handler 副作用 = 邮件出站且幂等。

### B. 同步直发

1. 同一请求：compose → 插 `email_messages`（`queued` 或直接准备 submit）→ `submit` → 写 provider ack。  
2. Provider **transient** 失败：按 INPUTS 重试预算或返回 `EMAIL_PROVIDER_UNAVAILABLE`；**仍须**幂等键，避免客户端重试双发。  
3. 同步路径 **不免除** Webhook 后续状态（delivered/bounced）；ack ≠ delivered。

### 事务边界（异步默认）

```text
BEGIN
  business_write(...)
  INSERT email_messages (... state=queued, idempotency_key=...)
  enqueue(job)   -- 同表或 outbox，与 workers-queue 一致
COMMIT
-- Worker 稍后 submit；COMMIT 前禁止副作用出站
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 地址在抑制表 | `EMAIL_SUPPRESSED`；不入队/不 submit |
| 幂等冲突 | `EMAIL_DUPLICATE`（默认） |
| 队列不可用 | 事务回滚或 outbox 可重试转发；禁假装已发送 |
| 同步 provider 5xx/429 | 可重试；须带同一幂等键 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 业务回滚（异步） | 无 queued 消息 / 无 Job |
| 抑制地址 | 拒绝；无 provider 调用 |
| 同键二次入队 | `EMAIL_DUPLICATE` |
| 同步快乐路径 | 记录存在且 state≥submitted |
