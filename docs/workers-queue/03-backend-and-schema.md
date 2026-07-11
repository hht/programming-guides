# 03 — 后端与 Schema

## 不变量

- INPUTS §1 **互斥**选一：PG SKIP LOCKED **或** Redis Streams。 
- Job **状态机**两边同形：`pending` → `claimed` → `succeeded` | `retry_scheduled` →（再 claim）| `dead`。 
- Schema / 流字段必须能承载：`idempotency_key`、`attempt`、`visible_at`、`payload`、错误摘要。

## 步骤规格（实现自写）

### A. PostgreSQL SKIP LOCKED（默认）

1. **建表**（形状对齐 [templates/schema.jobs.sql.example](./templates/schema.jobs.sql.example)；经 Atlas 迁移，见 postgres 册）： 
 - 列至少：`id`、`queue_name`、`job_type`、`payload`（jsonb）、`idempotency_key`、`state`、`attempt`、`max_attempts`、`visible_at`、`claimed_by`、`claimed_at`、`last_error`、`created_at`、`updated_at`。 
 - **唯一约束**：按 INPUTS §3 — `(idempotency_key)` 或 `(queue_name, idempotency_key)`。 
 - 索引：`(queue_name, state, visible_at)` 支撑 claim。 
2. **Claim SQL（规格）** 
 ```text
 WITH cte AS (
 SELECT id FROM jobs
 WHERE queue_name = $1
 AND state IN ('pending', 'retry_scheduled')
 AND visible_at <= now()
 ORDER BY visible_at
 FOR UPDATE SKIP LOCKED
 LIMIT $2
 )
 UPDATE jobs j SET
 state = 'claimed',
 claimed_by = $3,
 claimed_at = now(),
 visible_at = now() + ($4 || ' seconds')::interval, -- visibility timeout
 attempt = j.attempt + 1,
 updated_at = now()
 FROM cte WHERE j.id = cte.id
 RETURNING j.*;
 ``` 
3. **Ack**：`state = succeeded`（或删行若 INPUTS 写明选「成功即删」；默认保留可审计行）。 
4. **与 postgres 册**：事务、连接池、迁移规则不另起炉灶。

### B. Redis Streams（备选）

1. **Stream key** = `{prefix}stream:{queue_name}`；**group** = `{prefix}cg:{queue_name}`。 
2. **入队**：`XADD` 字段至少：`job_type`、`payload`、`idempotency_key`、`attempt`（初始 0）。 
 - 幂等存储（INPUTS §16 **互斥任选**）：**默认 Redis SET + TTL** 存 `idempotency_key → message_id`（键范围对齐 §3；TTL 默认对齐死信保留）；冲突 → `JOB_DUPLICATE`。其它存储仅 §16 写明。 
3. **Claim**：`XREADGROUP GROUP group consumer COUNT n STREAMS key >`；处理 PEL：超时用 `XAUTOCLAIM` / `XCLAIM`（idle ≥ visibility_timeout）。 
4. **Ack**：业务成功后 `XACK`；失败走 `08`（延迟可见 retry，或进死信流 `{prefix}stream:{queue_name}:dead`）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 表/流不存在 | 启动非 0；禁静默建临时内存结构 |
| 唯一约束冲突 | `JOB_DUPLICATE` |
| DB/Redis 不可达 | `QUEUE_UNAVAILABLE`；fail-closed 不假装已入队 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 两 Worker 同抢 | 同一 Job 不被两个 claim 同时持有（SKIP LOCKED / 组内投递） |
| 缺幂等唯一约束 | 迁移/探针失败 |
| 错误后端组合 | INPUTS / 启动拒绝 |
