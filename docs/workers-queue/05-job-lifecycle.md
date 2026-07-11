# 05 — Job Lifecycle（核心）

## 不变量

- 全文唯一核心路径名：**Job Lifecycle**。  
- 顺序钉死：**enqueue → claim → execute → ack / retry / dead-letter**。  
- **at-least-once**：同一 Job 可能 execute 多次；正确性依赖 [07](./07-idempotency.md)。  
- **ack 在副作用成功之后**；失败不得 ack。

## 步骤规格（实现自写）

### 1. Enqueue

1. 按 [04](./04-enqueue.md) 持久化 `pending`（或延时 `visible_at` 未来）。  
2. 产出 `job_id`；此时尚未执行副作用。

### 2. Claim

1. Worker 按 [06](./06-claim-and-visibility.md) 原子认领到期 Job。  
2. 状态 → `claimed`；设置 `visible_at = now() + visibility_timeout`；`attempt += 1`。  
3. 认领失败（空队列）→ 休眠/backoff 再拉；非错误。

### 3. Execute

1. 按 `job_type` 路由到业务 **handler**（词表同名）。  
2. Handler **先**做幂等门闸（`07`）：已成功过 → 直接走 ack（无二次副作用）。  
3. 执行副作用（发信、调支付、写投影等）。  
4. 墙钟超过可见性超时仍未结束 → 视为可能被他人 **re-claim**；handler 须可安全重入（幂等），不得假设独占无限时长。

### 4a. Ack（成功）

1. 副作用已提交成功。  
2. 持久化 `state = succeeded`（或成功即删，INPUTS）；Streams → `XACK`。  
3. 返回 Worker 循环拉下一条。

### 4b. Retry（可重试失败）

1. 失败分类为 **transient**（超时、`QUEUE_UNAVAILABLE` 下游、429 等）且 `attempt < max_attempts`。  
2. 按 [08](./08-retry-and-dead-letter.md) 写 `retry_scheduled` + `visible_at = now() + backoff` + `last_error`。  
3. **不** ack 为成功。

### 4c. Dead-letter（不可重试或超限）

1. `attempt >= max_attempts` **或** 失败分类为 **permanent**（校验错误、业务拒绝）。  
2. `state = dead`（或写入死信流/表）；保留 payload + `last_error`；可查询。  
3. **禁止**删除痕迹后假装成功。

### 伪代码（规格级）

```text
worker_loop(queue):
  job = claim(queue, visibility_timeout)     # step 2
  if job == nil: sleep; continue
  try:
    if already_succeeded(job.idempotency_key): ack(job); continue
    execute(job)                             # step 3
    ack(job)                                 # step 4a
  catch e:
    if retriable(e) and job.attempt < max_attempts:
      schedule_retry(job, e)                 # step 4b
    else:
      dead_letter(job, e)                    # step 4c
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 空队列 | 等待；非失败 |
| execute 成功 | ack |
| transient 且未超限 | retry |
| permanent 或超限 | dead-letter |
| claim 后进程崩溃 | 可见性到期后再次 claim（`06`） |
| 成功后 ack 存储失败 | 告警；可能重复 execute → 幂等必须成立 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 快乐路径 | enqueue→claim→execute→ack；状态 succeeded |
| 首次失败后成功 | 出现 retry_scheduled 再 succeeded；副作用按幂等仅一次有效 |
| 连续失败至上限 | state=dead；可查 last_error |
| 崩溃未 ack | 超时后另一 Worker 可 claim |
| 无幂等重复 execute | 测试红灯（`07`） |
