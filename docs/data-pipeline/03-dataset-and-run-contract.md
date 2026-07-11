# 03 — Dataset 与 BatchRun 契约

## 不变量

- 每个对外可用数据产品是一个 **Dataset**（逻辑名 + 键 + 字段契约）。 
- 每次执行是一个 **BatchRun**（或流式窗口 Run）；必须可查询状态与错误摘要。 
- 增量靠 **watermark**（水位）或显式 **窗口**；禁止「每次全表盲扫」却无 INPUTS 写明。

## 步骤规格（实现自写）

### 1. 登记 Dataset

1. 按 INPUTS §5 为每个 Dataset 写入契约：逻辑名、主键/自然键、字段列表或 Schema URL、Destination 定位。 
2. 契约变更须版本化（字段新增兼容 / 破坏性变更写明 + 双读窗口）；禁止静默改键列。

### 2. 开 BatchRun

1. 生成 `run_id`；写入 `idempotency_key`（INPUTS §6）；`state = pending`。 
2. 记录：`pipeline_name`、窗口或水位快照、`attempt`、时间戳。 
3. 默认 runner：enqueue workers-queue Job 后可选写 `queue_job_id`（与 Job 同 `idempotency_key` 或可追溯）；形状见 [templates/schema.batch_runs.sql.example](./templates/schema.batch_runs.sql.example)。 
4. 同键冲突 → `PIPELINE_DUPLICATE`（默认 reject）；resume-same-run 仅当 INPUTS 写明。

### 3. 水位读写

1. 增量：读取 `pipeline_watermarks`（或等价）中该 Source 的高水位。 
2. extract 成功推进候选水位；**仅 verify 通过后**提交水位（防半成功推进）。 
3. 全量：INPUTS 写明；仍须 BatchRun 记录。

### 4. 状态机（与 Lifecycle 对齐）

```text
pending → running → succeeded
 ↘ failed → (retry → running) | dead
```

阶段字段（可选但推荐）：`stage ∈ {extract, transform, load, verify}` 表示当前步。 
形状对齐 [templates/schema.batch_runs.sql.example](./templates/schema.batch_runs.sql.example) 与 [batch-run-state-matrix.md](./templates/batch-run-state-matrix.md)。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 缺 Dataset 契约 | 启动/enqueue 拒绝 |
| 幂等冲突 | `PIPELINE_DUPLICATE` |
| 水位表不可达 | `SOURCE_UNAVAILABLE` 或存储错误；fail-closed |
| 契约与目标表列不一致 | 迁移/启动非 0；禁运行时猜列 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 开 Run 快乐路径 | 行插入；state=pending |
| 同 idempotency_key | `PIPELINE_DUPLICATE`（默认） |
| verify 未过 | 水位不前进 |
| 缺主键契约 | 拒绝登记或测试红灯 |
