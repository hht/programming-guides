# 09 — 测试与 CI

指南**不附**可运行测试源码；实现仓按表自写。

## 单测探针（case → 期望）

| # | case | 期望 | 适用 |
|---|------|------|------|
| 1 | 快乐路径 Lifecycle | extract→transform→load→verify → succeeded；水位前进 | 全 |
| 2 | 同 idempotency_key | `PIPELINE_DUPLICATE`（默认）或 resume 书面行为 | 全 |
| 3 | extract 失败 | 不 load；可 retry | 全 |
| 4 | load 两遍（upsert/分区） | 业务行无重复 | 全 |
| 5 | verify 失败 | ≠succeeded；水位不变 | 全 |
| 6 | 跳过 verify 标成功 | 红灯 | 全 |
| 7 | 空结果策略 | 符合 INPUTS 允许/禁止空 | 全 |
| 8 | 主键唯一 Check | 重复键 → VERIFY_FAILED | 全 |
| 9 | workers-queue 重试至死信 | BatchRun dead 可查 | 默认 runner |
| 10 | 无源/目标 URL | 启动非 0 | 全 |
| 11 | 未勾选编排器却依赖 Airflow | 验收/lint 红灯 | 全 |
| 12 | 流式映射四步 | ingest 失败不 commit offset | streaming |
| 13 | dbt test 映射 | 失败 → VERIFY_FAILED | dbt |

## 发版场景 × 断言矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | staging 源/目标可达 | 连接探测 exit 0（无密钥入库） |
| 2 | Batch Job Lifecycle 快乐路径 | 与单测 1 一致 |
| 3 | 失败重试与死信 | 单测 3、9 |
| 4 | 幂等装载 + verify 门闸 | 单测 2、4、5 |
| 5 | Runner 裁剪 | 仅启用 INPUTS 所选路径 |
| 6 | `check` | exit 0 |

PR：`check`。发版：同 + 矩阵适用行。
