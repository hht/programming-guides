# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
# 实现仓建议落点（按应用册微调；词根不变）
features/<capability>/ # 例 orders/、billing/
 <pipeline>/ # 例 daily-settle/ — 与 pipeline_name 同词根
 extract.go|ts|py
 transform.go|ts|py
 load.go|ts|py
 verify.go|ts|py
 enqueue.go|ts|py # 触发 BatchRun（禁 PipelineManager）
internal/pipeline/ # 或 src/shared/pipeline/ — BatchRun 状态机、水位（基础设施名允许）
cmd/worker/ # 或对接 workers-queue worker 入口
ops/
 pipelines.md # 可选：积压/失败 run 运维说明（非第三方 APM 必勾）
migrations/ # batch_runs / pipeline_watermarks（对齐 postgres/Atlas）
# 若 INPUTS 勾选 dbt：
transform/dbt/ # 模型与 tests；仍由 06/07 门闸调用
# 若 INPUTS 勾选 Airflow/Dagster：
orchestrator/ # DAG 或 definitions — 仅映射 05，不另起成功定义
```

依赖方向：`features/<业务管线> → pipeline 封装 → workers-queue|编排适配 → 源/目标`；**禁** HTTP handler 内同步跑完整 ETL 无超时/无 run 记录冒充生产。 
状态机 SSOT：本册 `05`；禁第二份「pipeline status enum」分叉。

UI 状态矩阵：本品类默认 **N/A**（若产品暴露「同步状态」页，状态名必须用 Pass1 词表 + [templates/batch-run-state-matrix.md](./templates/batch-run-state-matrix.md)）。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建或更新 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。 
2. **pipeline_name、Dataset、BatchRun、Source、Destination** = 业务能力/数据产品词根（`orders.daily_settle`、`LedgerEntry`），禁 `etl1`、`job_data`、`processFile`。 
3. **禁**技术翻译名进领域模块主名：`*PipelineManager`、`*ETLService`、`*DataProcessor`、`handleExtract*`、`processPipeline*`（基础设施可用 `PipelineClient` / `BatchRunner` 入口例外）。 
4. **禁**同义词分叉：`extract`/`ingest`/`pull` 词表只留一个（批默认 **`extract`**；流式映射词 **`ingest`→extract`** 写在词表，不双 SSOT）；成功确认用 **`succeeded`**；失败路径 **`retry`** / **`dead`**（对齐 workers-queue）。 
5. 四步操作名冻结：`extract`、`transform`、`load`、`verify`。

| 概念 | 正例 | 反例 |
|------|------|------|
| 管线名 | `orders.daily_settle`、`billing.usage_snap` | `etl_default`、`pipeline1`、`tmp_sync` |
| Dataset | `SettledOrder`、`UsageSnapshot` | `TableDto`、`RawData`、`TmpDataset` |
| 运行 | `BatchRun`、`idempotency_key` | `JobDto`、`uuid-only` 无窗口维度 |
| 步骤 | `extract`、`transform`、`load`、`verify` | `processData`、`doETL`、`handleSync` |
| 状态 | `pending`、`running`、`succeeded`、`failed`、`dead` | `processing2`、`ok_flag`、`err` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| pipeline_name | `dot` 或 `kebab` 分段；全文一种 |
| 表名 | `batch_runs`、`pipeline_watermarks`；列 `snake_case` |
| 对象暂存前缀 | `{env}/{pipeline_name}/{run_id}/` |
| 队列名（workers-queue） | `pipeline.{business}` |
| 环境变量 | `APP_ENV`、源/目标 URL 名、`PIPELINE_MAX_ATTEMPTS`、`BATCH_WINDOW` |
| Go 导出 | `PascalCase`；TS/Python 跟应用册 |
