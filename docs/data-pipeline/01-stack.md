# 01 — 栈（钉死）

| 层 | 选择 |
|----|------|
| **执行模式** | **Batch**（默认）；Streaming 仅 INPUTS §1 |
| **默认 Runner** | **[workers-queue](../workers-queue/README.md)**：每条 Batch Job（或阶段 Job）走 Job Lifecycle |
| **条件编排** | **Apache Airflow** *或* **Dagster**（INPUTS §2 **互斥**恰好一家；未勾选 **禁止**引入） |
| **落地 / 权威库** | **PostgreSQL ≥16**（对齐 [postgres](../postgres/README.md)：Atlas 迁移）作 BatchRun 元数据 + 常见 Destination |
| **暂存** | 默认 **对象存储**前缀（[object-storage](../object-storage/README.md)）或 **PG staging schema**（INPUTS §12） |
| **变换** | **应用内变换**（默认，与应用册同语言）；**dbt** 仅 INPUTS §13 |
| **映射学习（非默认）** | Airbyte 连接器形状、Meltano 声明式 ELT、dbt test — 对照 Lifecycle，**不**替换上表裁决 |
| **禁止冒充** | **裸 cron 无 run 表** / **无重试脚本** / **setTimeout 伪队列** 不得进入验收路径 |

禁止：留下「Airflow 或 workers-queue 任选」开口；未写条件理由默认引入编排器；生产无 verify。

## 脚手架

```bash
# --- 默认：batch + workers-queue ---
# 1) 对齐 workers-queue：INPUTS 钉 PG SKIP LOCKED 或 Streams；队列名 = pipeline.*
# 2) 复制 templates/schema.batch_runs.sql.example → 迁移（BatchRun / VerifyCheck 结果）
# 3) 配置 staging/prod 源/目标连接名（值不入库）
# 4) Worker handler：按 05 顺序调用 extract→transform→load→verify；失败分类见 05/08

# --- 条件：Airflow（仅 INPUTS §2）---
# 1) DAG 任务图必须可映射到 05 四步（可多 task，但成功边依赖 verify）
# 2) 运行状态回写 BatchRun 表（或等价）；禁只存在于 Airflow UI

# --- 条件：Dagster（仅 INPUTS §2）---
# 1) job/asset 物化顺序映射 05；verify 为成功门闸 op/asset check
# 2) 同上：BatchRun 为应用侧真相

# --- 条件：streaming（仅 INPUTS §1）---
# 1) 消费循环仍实现 08 映射四步；verify 可微批窗口
# 2) Runner 仍须能重试/死信（workers-queue 或书面等价）
```

## 版本

| 项 | 策略 |
|----|------|
| PostgreSQL | **≥16**（与 postgres 册一致） |
| workers-queue | 跟本仓 workers-queue 指南；不另起队列产品 |
| Airflow（若勾选） | 跟部署面当前稳定大版本；补丁跟安全公告 |
| Dagster（若勾选） | 跟官方稳定发行；锁在实现仓 |
| dbt（若勾选） | dbt-core 跟 P1 标杆大版本策略；适配器与目标仓匹配 |
| 客户端 / 语言 | 跟应用册；ETL 脚本默认可 Python **≥3.12** 或应用同语言 — INPUTS 书面钉一种 |

## 冲突裁决（写入 sources）

编排器下载量与生态（Airflow）**不**单独定胜负；**与应用同库可运维的薄 runner（workers-queue）优先**。Airflow/Dagster 在「多仓依赖图 / 资产平台」条件满足时再钉。ELT 产品（Airbyte/Meltano）作**标杆学习**，默认不绑其控制面为 SSOT。
