# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写管线 / Batch Job 实现**。 
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL / 表名 / P0）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **执行模式（互斥任选其一）** | □ **batch**（**默认**） □ **streaming**（须写明理由：持续事件源 + 延迟预算）— **禁止**「批或流任选」双开口；勾 streaming 时仍须遵守 `08` 四步映射，**不**另起核心路径名 |
| 2 | **Runner（互斥任选其一）** | □ **workers-queue**（**默认**：对齐 [workers-queue](../workers-queue/README.md)） □ **Airflow**（条件） □ **Dagster**（条件）— **禁止**默认采用 Airflow/Dagster；勾后两家须写明：≥N 依赖任务 / 跨仓调度 / 资产血缘产品需求 |
| 3 | **源清单** | ≥1 个 **Source**（类型：□ DB □ API □ 对象存储 □ 文件 □ 其它书面）；连接密钥名成对（值不入库）；抽取范围谓词（全量 / 增量水位字段） |
| 4 | **目标清单** | ≥1 个 **Destination**（□ PG 表 □ 对象前缀 □ 仓表 □ 其它书面）；装载语义写明：□ append □ upsert（键列名）□ replace-partition（分区键） |
| 5 | **Dataset 契约** | 每个落地 Dataset：逻辑名、主键或自然键、字段表或 Schema URL、所有者团队；见 `03` |
| 6 | **幂等键策略** | 每次 **BatchRun** **必填** `idempotency_key`（业务词根 + 窗口/水位维度）；唯一性：□ 全局 □ 按 `pipeline_name`；冲突：□ **reject**（默认） □ resume-same-run（须写明） |
| 7 | **校验门闸** | ≥1 条 **VerifyCheck**（行数阈值 / 空集禁止 / 主键唯一 / 参照完整 / 自定义 SQL 断言）；**全部通过**才可 `succeeded`（见 `07`） |
| 8 | **错误码表** | 至少：`PIPELINE_DUPLICATE` / `EXTRACT_FAILED` / `TRANSFORM_FAILED` / `LOAD_FAILED` / `VERIFY_FAILED` / `PIPELINE_DEAD` / `SOURCE_UNAVAILABLE` → 应用/内部映射 |
| 9 | **环境成对** | staging/prod：`APP_ENV`、源/目标连接名、`PIPELINE_MAX_ATTEMPTS`（**默认 5**）、可选 `BATCH_WINDOW` |
| 10 | **应用册对接** | □ go □ fastapi □ nextjs □ workers-queue-only □ 多册 — 本册为 Batch Job Lifecycle SSOT |

## 若适用

| # | 项 | 何时 |
|---|-----|------|
| 11 | **workers-queue 对接** | Runner=workers-queue：**必填**队列名（例 `pipeline.orders_daily`）+ 可见性超时（默认对齐 workers-queue **300s** 或在 INPUTS 写明；长跑可更高） |
| 12 | **暂存介质** | 默认 □ **对象存储前缀**（对齐 object-storage）□ **PG staging schema** □ 内存仅单测；生产禁「只落 /tmp 无审计」 |
| 13 | **变换引擎** | □ **应用内变换**（默认）□ **dbt**（写明：SQL 模型仓路径）— 禁止同时启用双引擎却不说明 |
| 14 | **水位 / 窗口** | 增量：水位字段名 + 存储表/键；批窗口：□ 日历日 □ 小时 □ 其它书面 |
| 15 | **Airflow** | Runner=Airflow：部署面（Composer / 自建）+ DAG id 命名规则 + 与本册状态机字段映射表 |
| 16 | **Dagster** | Runner=Dagster：code location + job/asset 名规则 + 状态映射表 |
| 17 | **流式等价** | 勾 streaming：写明消息系统（□ Kafka □ Pub/Sub □ 其它书面）+ 消费组 + **exactly 映射** `ingest→extract` / `process→transform` / `sink→load` / `verify→verify` |
| 18 | **禁止清单确认** | 勾选：□ **不**用无重试的裸 cron 脚本冒充生产管线；□ **不**把「装载成功、校验跳过」标为 succeeded；□ **不**默认引入第二家编排器 |

## Runner 裁剪

| Runner | 必读章 | 可 N/A |
|--------|--------|--------|
| workers-queue（默认） | 03–08；workers-queue 册 | `08` Airflow/Dagster 部署细节 |
| Airflow | 03–07 + `08` Airflow 节 | Dagster 节；仍须理解 `05` |
| Dagster | 03–07 + `08` Dagster 节 | Airflow 节；仍须理解 `05` |
| streaming | 03–07 + `08` 流式节 | 批窗口日历细节可按源裁 |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
