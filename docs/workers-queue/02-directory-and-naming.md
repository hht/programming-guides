# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
# 实现仓建议落点（按应用册微调；词根不变）
internal/queue/ # 或 src/shared/queue/ — 连接、claim、ack（基础设施名允许）
features/<capability>/ # 业务能力：例 notify/、billing/
 <action>/ # 例 send-receipt/ — enqueue 调用与 handler 同词根
 handler.go|ts|py # 执行副作用（幂等）
 enqueue.go|ts|py # 入队（可与领域命令同文件，禁 JobManager）
cmd/worker/ # 或 workers/<queue_name>/ — 进程入口
ops/
 queue.md # 可选：积压/死信运维说明（非第三方 APM 必勾）
migrations/ # PG：jobs 表（对齐 postgres/Atlas）
```

依赖方向：`features/<业务> → queue 封装 → PG|Redis`；**禁** HTTP handler 内 `setTimeout` 冒充出队。 
状态机 SSOT：本册 `05`；禁第二份「job status enum」分叉。

UI 状态矩阵：本品类默认 **N/A**（基础设施；若产品暴露「任务状态」页，状态名必须用 Pass1 词表）。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建或更新 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。 
2. **队列名、Job 类型、handler、idempotency_key 维度** = 业务能力/操作词根（`email.send`、`order.fulfill`），禁 `job1`、`task_data`、`processItem`。 
3. **禁**技术翻译名进领域模块主名：`*JobManager`、`*QueueService`、`*WorkerHelper`、`handleJob*`、`processQueue*`（基础设施可用 `QueueClient` / `Worker` 入口例外，见 meta）。 
4. **禁**同义词分叉：`claim`/`lease`/`fetch`/`reserve` 词表只留一个（本册默认 **`claim`**）；`ack`/`complete`/`succeed` 只留 **`ack`**（成功确认）；失败路径用 **`retry`** / **`dead_letter`**。 
5. 对外若暴露 Job id / 状态字段，协议名冻结在词表。

| 概念 | 正例 | 反例 |
|------|------|------|
| 队列名 | `email.send`、`order.fulfill` | `default`、`queue1`、`jobs_tmp` |
| Job 类型 | `SendReceipt`、`FulfillOrder` | `GenericJob`、`TaskDto` |
| 操作 | `enqueue`、`claim`、`ack`、`deadLetter` | `handleJob`、`processTask`、`doWork` |
| 幂等键 | `order:{id}:fulfill` | `uuid-only`（无业务维度）、`tmp_key` |
| 状态 | `pending`、`claimed`、`succeeded`、`retry_scheduled`、`dead` | `processing2`、`err_flag` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| 队列名 | `kebab` 或 `dot` 分段业务名；全文一种；禁空格 |
| 表名（PG） | `jobs`（或 `{prefix}_jobs`）；列 `snake_case` |
| Stream key | `{prefix}stream:{queue_name}` |
| Consumer group | `{prefix}cg:{queue_name}` |
| Go 导出 | `PascalCase`；TS/Python 跟应用册 |
| 环境变量 | `DATABASE_URL` / `REDIS_URL`、`WORKER_CONCURRENCY`、`JOB_VISIBILITY_TIMEOUT_SECONDS`、`JOB_MAX_ATTEMPTS` |
