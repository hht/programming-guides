# 00 — 原则与不变量

## 品类

业务把外部或内部数据按约定 **抽取 → 变换 → 装载 → 校验**；同一次运行意图可重放且不因至少一次执行产生重复副作用；未通过校验不得标为成功。

## 核心正确性路径（全文唯一）

**Batch Job Lifecycle**：**extract → transform → load → verify**。规格见 [05](./05-batch-job-lifecycle.md)。契约见 `03`；抽取见 `04`；变换/装载见 `06`；校验见 `07`；runner/编排/流式见 `08`——**不替代**本路径名。

## 硬不变量

1. **批处理默认**：未在 INPUTS §1 书面选 streaming 前，禁止以流式框架为默认 SSOT。  
2. **Runner 默认 = workers-queue**：有后台执行面时对齐 [workers-queue](../workers-queue/README.md)（入队·认领·重试·死信·幂等）；**Airflow / Dagster 仅条件**（INPUTS §2）。  
3. **每次 BatchRun 必有 `idempotency_key`**；冲突按 INPUTS（默认 reject）。  
4. **四步不可跳**：不得「只 load 不 verify」却标 `succeeded`；verify 失败 → 不得对外发布 Dataset 为可用。  
5. **投递/执行语义默认 at-least-once**；装载与副作用 **必须**可重入（upsert / 分区替换 / 幂等写）；禁止无幂等却宣称 exactly-once。  
6. **成功定义**：仅当 verify **全部**通过 → `succeeded`；extract/transform/load 任一步失败 → 按 runner 重试或死信。  
7. **禁止**裸 cron + 无持久化状态的脚本冒充生产管线（无重试上限、无死信、无 run 记录）。  
8. **deletion-first**：无平行第二套「管线产品」SSOT；无 `*PipelineManager` / `*ETLService` 领域主名（见 `02`）。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 源/目标 / Runner / 校验清单 / 数字 | `INPUTS.md` |
| Dataset / BatchRun 契约与水位 | `03-dataset-and-run-contract.md` + templates |
| 抽取 | `04-extract.md` |
| Lifecycle 步骤 | `05-batch-job-lifecycle.md` |
| 变换与装载 | `06-transform-and-load.md` |
| 校验与成功门闸 | `07-verify.md` |
| Runner / 条件编排 / 流式映射 | `08-runner-orchestration-and-streaming.md` |
| Job 认领/重试/死信（默认 runner） | [workers-queue](../workers-queue/README.md) |
| PG 迁移/事务通识 | [postgres](../postgres/README.md) |
| 对象暂存 | [object-storage](../object-storage/README.md)（若勾选） |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止

- 指南仓堆可运行 ETL 业务模块 / 真连接串  
- 默认钉 Airflow 或 Dagster 为唯一 runner  
- 装载成功即对外「数据已就绪」而跳过 verify  
- 无幂等键的生产 BatchRun  
- 批与流两套互不相干的状态机名词（须映射到同一四步）  

## 超越（对照写入 11）

1. `对照：B 中同步/模型跑通常即可标成功，应用级 VerifyCheck 弱或不统一 → 本指南要求 verify 硬门闸，未通过不得 succeeded（见 07/05）`  
2. `对照：B 中编排器常为默认入口 → 本指南默认 workers-queue 承载 Batch Job，Airflow/Dagster 仅 INPUTS 条件启用（见 01/08）`  
