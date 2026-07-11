# 05 — Batch Job Lifecycle（核心）

## 不变量

- 全文唯一核心路径名：**Batch Job Lifecycle**。  
- 顺序钉死：**extract → transform → load → verify**。  
- 编号不可跳步；**verify 通过前**不得 `succeeded`，不得提交水位，不得对外宣布 Dataset 可用。  
- 执行由 INPUTS Runner 承载；默认 **at-least-once** + 幂等装载。  
- 流式勾选时步骤语义不变，仅词面映射见 [08](./08-runner-orchestration-and-streaming.md)。

## 与 workers-queue 对齐（默认 runner）

本路径是 **业务四步**；workers-queue [Job Lifecycle](../workers-queue/05-job-lifecycle.md) 是 **执行壳**：

| Batch Job 步骤 | workers-queue 对应 |
|----------------|-------------------|
| 触发开 Run / enqueue | **enqueue**（`job_type`/`queue`=`pipeline.*`；`idempotency_key` 与 BatchRun 同键或可追溯） |
| 开始四步前 | **claim**（可见性超时 ≥ 单次批墙钟；INPUTS §11） |
| extract → transform → load → verify | **execute**（handler 内顺序调用；禁跳 verify） |
| verify 全过 + 水位提交 | **ack**（仅此时）；BatchRun `succeeded` |
| 任一步 transient 且未超限 | **retry**（`retry_scheduled`）；BatchRun `failed`→再 `running` |
| permanent 或超限 | **dead-letter**；BatchRun `dead`；可查 `last_error` |

条件编排（Airflow/Dagster）仍须实现同一四步与成功定义；见 `08`。

## 步骤规格（实现自写）

### 1. Extract

1. 按 [03](./03-dataset-and-run-contract.md) 开或恢复 BatchRun；`stage = extract`。  
2. 按 [04](./04-extract.md) 拉源 → 暂存；失败 → 分类后 retry/dead（对齐 runner）。  
3. 产出 `staging_ref`。

### 2. Transform

1. `stage = transform`。  
2. 按 [06](./06-transform-and-load.md) 将暂存变为 **符合 Dataset 契约** 的记录集（应用内或 dbt）。  
3. 失败 → `TRANSFORM_FAILED`；不 load。

### 3. Load

1. `stage = load`。  
2. 按 [06](./06-transform-and-load.md) 与 INPUTS §4 语义写入 Destination（append / upsert / replace-partition）。  
3. 装载必须可重入：重复 load 同 `run_id`/幂等键不得产生重复业务行（upsert 或分区替换）。  
4. 失败 → `LOAD_FAILED`；Destination 保持可恢复（事务回滚或分区未切换）。

### 4. Verify

1. `stage = verify`。  
2. 按 [07](./07-verify.md) 跑完 INPUTS §7 全部 VerifyCheck。  
3. **任一条失败** → `VERIFY_FAILED`；`state = failed`（可 retry）或按策略 dead；**水位不提交**；Dataset **不可用**。  
4. **全部通过** → 提交水位；`state = succeeded`；此时才可下游消费；默认 runner 才 **ack** Job。

### 伪代码（规格级）

```text
# workers-queue handler（默认）
on_claimed(job):
  run = open_or_resume(job.idempotency_key)     # 03
  try:
    staging = extract(run)                      # step 1 / 04
    framed  = transform(run, staging)           # step 2 / 06
    load(run, framed)                           # step 3 / 06
    checks = verify(run)                        # step 4 / 07
    if any_failed(checks):
      raise VerifyFailed(checks)
    commit_watermark(run)
    mark_succeeded(run)
    ack(job)                                    # workers-queue 4a；verify 前禁止 ack
  catch e:
    classify = classify_error(e)
    sync_batch_run(run, classify)               # failed | dead
    schedule_retry_or_dead(job, classify)       # workers-queue 4b/4c
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 任一步 transient | runner 重试；`attempt < max`（默认 `PIPELINE_MAX_ATTEMPTS=5`） |
| permanent 或超限 | `dead`；保留 last_error；可查询 |
| verify 失败 | 不得 succeeded；不得 ack；默认 transient（数据可自愈）或 INPUTS 钉 permanent |
| 成功后 ack/状态写失败 | 告警；可能重复 execute → load/verify 必须幂等 |
| 空队列 / 无调度 | 等待；非本 Lifecycle 失败 |
| claim 后进程崩溃 | 可见性到期再 claim；四步可重入 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 快乐路径 | 四步顺序执行；state=succeeded；水位前进；Job ack |
| load 成功 verify 失败 | state≠succeeded；水位不变；对外不可用；**不** ack 成功 |
| 同键重放 | 无重复业务行；最终至多一次有效 succeeded |
| extract 失败 | 不 transform/load；可 retry |
| 跳过 verify 标成功 / 提前 ack | 测试红灯（禁路径） |
| 重试耗尽 | Job dead + BatchRun dead；可查 last_error |
