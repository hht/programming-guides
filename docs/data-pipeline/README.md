# Data Pipeline — ETL / 批处理数据管线指南

> **这是工程指南，不是半成品项目。** 
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **批处理数据管线**：抽取、变换、装载、校验。 
> **默认栈**：**批处理优先**；一次 **Batch Job** 由 [workers-queue](../workers-queue/README.md) **Job Lifecycle** 承载执行 / 重试 / 死信；落地区对齐 [postgres](../postgres/README.md) 与可选 [object-storage](../object-storage/README.md)。**Airflow / Dagster 仅条件启用**（INPUTS 互斥任选一家编排器时）。**流式不是默认**；若启用，写明等价四步映射（见 `08`），**禁止**与批处理双 SSOT。 
> **来源**：[sources.md](./sources.md)

## 品类一句话

业务把外部或内部数据按约定 **抽取 → 变换 → 装载 → 校验**；同一次运行意图可重放且不因至少一次执行产生重复副作用；未通过校验不得标为成功。

## 核心正确性路径

**Batch Job Lifecycle**（[05](./05-batch-job-lifecycle.md)）：

`extract → transform → load → verify`（编号步骤）。

流式等价（仅 INPUTS 勾选流式时）：`ingest → process → sink → verify` → 映射到上列四步，**不**另开第二条核心路径名。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；编排器 / 流式互斥已遵守 
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`） 
3. 必读 [03](./03-dataset-and-run-contract.md) + [04](./04-extract.md) + [05](./05-batch-job-lifecycle.md) 
4. 落地 [06](./06-transform-and-load.md) / [07](./07-verify.md) / [08](./08-runner-orchestration-and-streaming.md) 
5. 对接 [workers-queue](../workers-queue/README.md)（默认 runner）；若 INPUTS 勾选 Airflow/Dagster → 仅按 `08` 条件章，**Lifecycle 步骤仍以本册 `05` 为 SSOT** 
6. [commands.md](./commands.md) `check` 绿 
7. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者） 

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；源/目标 / 编排互斥 / 数字门闸 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-dataset-and-run-contract.md) | Dataset / BatchRun 契约与水位 |
| [04](./04-extract.md) | 抽取与暂存 |
| [05](./05-batch-job-lifecycle.md) | **Batch Job Lifecycle（核心）** |
| [06](./06-transform-and-load.md) | 变换与装载 |
| [07](./07-verify.md) | 校验门闸与成功定义 |
| [08](./08-runner-orchestration-and-streaming.md) | workers-queue 默认；Airflow/Dagster 条件；流式映射 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | schema / env / 状态矩阵例 |
