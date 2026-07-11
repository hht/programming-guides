# 04 — 入队（Enqueue）

## 不变量

- Enqueue **必须**携带：`queue_name`、`job_type`、`payload`、`idempotency_key`。 
- PG 默认：**业务写与 enqueue 同事务**（INPUTS §11）；业务回滚则 Job 不得残留。 
- Streams 默认：**唯一**路径 = **outbox + 转发 `XADD`**（INPUTS §17）；其它路径须在 §17 写明。 
- 禁止「先返回成功再尽力入队」而无 outbox/补偿的写明的方案。

## 步骤规格（实现自写）

1. **校验** 
 - `queue_name` ∈ INPUTS §7；`idempotency_key` 非空且符合词表维度；`payload` 可序列化且有大小上限（默认 **256 KiB**，改则 INPUTS）。 
2. **幂等预检**（可选读；最终以唯一约束为准） 
 - 已存在同键且未 dead → 按 INPUTS：默认 **reject** → `JOB_DUPLICATE`；coalesce → 返回已有 `job_id`。 
3. **持久化** 
 - **PG**：`INSERT INTO jobs (…) state='pending', attempt=0, visible_at=now(), max_attempts=INPUTS`；同事务提交业务。 
 - **Streams**：**默认** 业务与 **outbox 同行同事务**写入，转发器再 `XADD`（INPUTS §17）；**禁止**规格默认「业务后直接 XADD / 告警+重试入队」与 outbox 并列开口。其它路径须在 §17 写明。**禁止**入队成功但业务未提交却已执行。 

4. **返回** 
 - `job_id`（PG uuid/bigint 或 Stream entry id）给调用方；不暴露内部 claim token。 
5. **延时入队（可选）** 
 - `visible_at = now() + delay`；Streams 用延迟队列或 `visible_at` 旁路表——须在 INPUTS 写明；默认可不支持。

### 伪代码（规格级）

```text
enqueue(cmd):
 require cmd.idempotency_key
 begin tx: # PG 默认
 apply_business(cmd) # 权威源变更
 insert job(pending, key=cmd.idempotency_key, …)
 commit
 return job.id
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 缺幂等键 | 校验失败；不入队 |
| 重复键 | `JOB_DUPLICATE`（默认） |
| payload 过大 | 校验失败 |
| 事务中业务失败 | 整单回滚；无 Job 行 |
| 存储不可达 | `QUEUE_UNAVAILABLE` |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 业务回滚 | 无 pending Job |
| 同键二次入队 | `JOB_DUPLICATE`（默认） |
| 缺幂等键 | 入队被拒 |
| 成功入队 | 可被 claim |
