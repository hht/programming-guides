# 来源与差距

## 品类

业务 **批处理数据管线**：按约定 **抽取 → 变换 → 装载 → 校验**；默认由 [workers-queue](../workers-queue/README.md) 承载执行 / 重试 / 死信。**流式非默认**（仅 INPUTS）。**非**编排器百科、不把托管 ELT 控制面当作唯一方案。

核心路径：**Batch Job Lifecycle**（`extract → transform → load → verify`）。

## P0（≥3）

| 主题 | URL |
|------|-----|
| Singer Specification（抽取/状态消息形状） | https://github.com/singer-io/getting-started/blob/master/docs/SPEC.md |
| dbt 数据测试（完成门闸断言） | https://docs.getdbt.com/docs/build/data-tests |
| PostgreSQL `INSERT … ON CONFLICT`（幂等装载） | https://www.postgresql.org/docs/current/sql-insert.html |

## 标杆 B（开源 P1 · 恰好 3）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [airbytehq/airbyte](https://github.com/airbytehq/airbyte) | P1 | 源→目标同步 Job、连接配置、可调度离散运行 | 照搬 Airbyte 控制面 / 云产品为默认 SSOT | 配置源与目标后跑同步把数据拉进仓 |
| B | [dbt-labs/dbt-core](https://github.com/dbt-labs/dbt-core) | P1 | SQL 变换模型、data test 作完成门闸、版本化变换 | 约定 dbt 为唯一变换引擎；忽略 extract/load | 仓内变换 + 测试通过才算模型可信 |
| C | [meltano/meltano](https://github.com/meltano/meltano) | P1 | 声明式 ELT 流水线、插件化抽取/装载、可调度跑批 | 照搬 Meltano CLI 为唯一 runner | 用声明配置跑通 extract/load（+ 变换）批任务 |

映射学习（非 B 共有证据源、不作默认）：[apache/airflow](https://github.com/apache/airflow)、[dagster-io/dagster](https://github.com/dagster-io/dagster) — **仅当 INPUTS 条件启用编排**时对照 DAG/asset 语义；默认 runner 仍为 workers-queue。Singer SPEC（P0）作抽取/水位消息对照，不指定 Singer 运行时为唯一实现。

## 共有能力切条（用户 / 数据消费者可感知）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 从配置的源抽取数据 | ✓ | — | ✓ | **必做** |
| 变换为可消费形态 | — | ✓ | ✓ | **必做** |
| 装载到配置的目标 | ✓ | — | ✓ | **必做** |
| 运行后测试/校验再视为完成 | 弱/可选 | ✓ | ✓（可接 dbt test） | **必做**（≥2：B+C） |
| 以可调度离散 Job/流水线运行 | ✓ | ✓ | ✓ | **必做** |
| 托管控制面 / 云编排仪表 | ✓ | — | — | **参考**（不进必勾） |

> **共有必做**仅上表 ≥2 源证据。verify **硬门闸**与 **workers-queue 默认** → 见差距表「超越」与 `11` §C a1/a2。

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做 |
|------|------|------|------|------|
| Batch Job Lifecycle 编号四步 | A,B,C + P0 | 功能 | `05` | 必做 |
| Dataset / BatchRun / 水位契约 | 工程 + Singer state 对照 | 工程 | `03` | 必做 |
| Extract → 暂存隔离 | A,C + Singer | 工程 | `04` | 必做 |
| Transform + 可重入 Load | B,C + P0 ON CONFLICT | 工程 | `06` | 必做 |
| VerifyCheck 硬门闸（超越） | B,C 更强 / A 更弱 | 工程 | `07` / `11` a1 | 超越 |
| workers-queue 默认 runner | 对齐本仓 + 超越 a2 | 工程 | `08`/`01` | 必做（默认） |
| Airflow/Dagster 条件章 | 映射学习 | 工程 | `08` | 条件 |
| 流式四步映射写明 | 品类边界 | 工程 | `08`/INPUTS | 条件 |
| 禁裸 cron 伪管线 | 工程 | 工程 | `00`/`01` | 必做/超越 |
| 托管 APM / 云控制面 | A | 参考 | — | 参考 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| Airflow 星标与生态更大 | **不作默认 runner**；条件启用；学 DAG 依赖与重试，成功定义仍以 `05`+`07` 为准 |
| Dagster asset 思想先进 | 同左；与 Airflow **互斥**；未满足 INPUTS 条件禁止引入 |
| Airbyte/Meltano 控制面开箱即用 | **标杆学习**；默认自研薄 Batch Job + workers-queue，避免双 SSOT |
| dbt 是否默认变换 | **否**；默认应用内变换；dbt 仅 INPUTS §13 |
| Singer 是否默认运行时 | **否**；学 SPEC 的 state/record 边界；实现可自写 extract |
| 流式框架作默认 | **否**；batch 默认；streaming 映射到同一四步 |
| 宣称 exactly-once | **禁止**（未另证）；默认 **at-least-once + 幂等 load** |
