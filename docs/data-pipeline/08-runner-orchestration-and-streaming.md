# 08 — Runner、条件编排与流式映射

## 不变量

- **默认 Runner = workers-queue**；Batch Job 的重试 / 死信 / 可见性 / 幂等 **对齐** [workers-queue](../workers-queue/README.md)。 
- **Airflow / Dagster 条件启用**：仅 INPUTS §2；启用后 **成功定义仍以本册 `05`+`07` 为准**，编排 UI 不是 SSOT。 
- **流式非默认**：勾选后写明映射表，**不**新增第二条核心路径名。

## 步骤规格（实现自写）

### A. workers-queue（默认）

1. `enqueue`：业务触发或调度器写入 Job；`job_type` / 队列名 = `pipeline.*`；`idempotency_key` 与 BatchRun 同键或可追溯关联（见 `05` 映射表）。 
2. Worker `claim` → handler 调 `05` 四步（**verify 通过前禁止 ack**）。 
3. 四步成功 → **ack**；失败 → workers-queue **retry / dead-letter**；BatchRun `state` 同步（`failed` / `dead`）。 
4. 可见性超时：默认建议 **≥ 单次 Batch 墙钟**（INPUTS §11；默认起点 **300s**，长跑明确上调）。 
5. 重试 / 死信数字与分类对齐 [workers-queue/08](../workers-queue/08-retry-and-dead-letter.md)；`PIPELINE_MAX_ATTEMPTS` 与 Job `max_attempts` **取合同一上限**（默认 5）。 
6. **禁止**绕过队列用裸进程「直接调 handler」作为唯一生产路径（本地单测除外）。

### B. Airflow（条件）

1. DAG 任务可拆多 node，但边依赖必须保证 **verify 在成功末端**。 
2. 每个 DAG run 对应（或创建）BatchRun；状态回写应用库。 
3. Airflow retry 与 `PIPELINE_MAX_ATTEMPTS` **取合同一上限策略**（写明：以谁为准）；禁无限重试。 
4. **不**把 XCom 当 Dataset SSOT；数据仍在 Destination / 暂存契约内。

### C. Dagster（条件）

1. job / asset 物化顺序映射 extract→transform→load；**asset check / op** 映射 verify。 
2. Run 元数据 ↔ BatchRun；失败 materialization 不得标 Dataset 可用。 
3. 与 Airflow 互斥；禁双编排器。

### D. 流式等价（条件）

写明默认映射（词表写入 `UBIQUITOUS_LANGUAGE.md`）：

| 流式词 | 批词（SSOT） |
|--------|----------------|
| ingest | extract |
| process | transform |
| sink | load |
| verify | verify |

1. 消费循环按微批或单事件调用映射后的四步；verify 可按窗口聚合。 
2. 仍须幂等 sink + 失败重试/死信；消息系统名见 INPUTS §17。 
3. **禁止**另写「Streaming Lifecycle」作为第二核心路径名。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 未勾选却引入 Airflow/Dagster | INPUTS / 验收红灯 |
| 编排成功但 BatchRun 非 succeeded | 禁；以 BatchRun 为准修适配 |
| 流式无 verify 窗口 | INPUTS 拒绝 |
| 队列不可用 | `SOURCE_UNAVAILABLE` / workers-queue `QUEUE_UNAVAILABLE`；fail-closed |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 默认路径 | Job enqueue→四步→ack；BatchRun succeeded |
| 重试耗尽 | Job dead；BatchRun dead；可查 last_error |
| Airflow 未勾选 | 仓库无强制 Airflow 运行时依赖 |
| 流式映射 | ingest 失败不 sink；verify 失败不提交偏移/水位 |
