# 00 — 原则与不变量

## 品类

应用把可延后工作交给后台：**入队 → 出队执行 → 失败重试 → 超限死信**；同一业务意图不因至少一次投递产生重复副作用。

## 核心正确性路径（全文唯一）

**Job Lifecycle**：**enqueue → claim → execute → ack / retry / dead-letter**。规格见 [05](./05-job-lifecycle.md)。认领细节见 `06`；幂等见 `07`；重试/死信见 `08`——**不替代**本路径名。

## 硬不变量

1. **后端互斥**：默认 **PostgreSQL `SKIP LOCKED` 队列表**（已有 PG 权威源时写明）；否则 **Redis Streams**。BullMQ/Sidekiq **不**作默认引擎（映射见 sources）。 
2. **每条 Job 必有 `idempotency_key`**；冲突按 INPUTS（默认 reject）。 
3. **可见性超时**与 **最大尝试次数** 必须写明数字或 INPUTS 必填项；超时未 ack → 可被再次 claim。 
4. **投递语义默认 at-least-once**；Handler **必须**按幂等设计；禁止无幂等却宣称 exactly-once。 
5. **ack 仅在业务副作用成功提交之后**（或明确标记为可丢弃的 pure side-effect 且 INPUTS 写明）。 
6. **超限 → 死信**（状态可查询）；禁止静默丢弃失败 Job。 
7. **禁止**用 `setTimeout`、进程内数组、无持久化的单进程 channel 冒充生产队列。 
8. **deletion-first**：无平行第二套队列产品；无 `*JobManager` 领域主名（见 `02`）。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 后端选择 / 超时 / 重试数字 / 队列名 | `INPUTS.md` |
| 表或流形状 | `03-backend-and-schema.md` + templates |
| 入队事务边界 | `04-enqueue.md` |
| Lifecycle 步骤 | `05-job-lifecycle.md` |
| claim / 可见性 | `06-claim-and-visibility.md` |
| 幂等键与副作用 | `07-idempotency.md` |
| 退避与死信 | `08-retry-and-dead-letter.md` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |
| PG 迁移/事务通识 | [postgres](../postgres/README.md) |

## 禁止

- 指南仓堆可运行 Worker / 队列业务模块 
- 生产用 `setTimeout` 当队列 
- 无幂等键入队 
- 失败超限后无死信、静默吞错 
- 有 PG 权威源却默认采用 BullMQ/Sidekiq 引擎（未在冲突表中写明并推翻） 

## 超越（对照写入 11）

1. `对照：B 中幂等/唯一 Job 常为可选或库扩展 → 本指南要求每条 Job 必填 idempotency_key，冲突默认 reject（见 07）` 
2. `对照：B 中可见「进程内延时/简化演示」或未统一禁伪队列 → 本指南禁止 setTimeout/内存数组冒充生产队列，且 visibility_timeout 与 max_attempts 必须写明或进 INPUTS（见 00/06/08）` 
