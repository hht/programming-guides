# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
# 实现仓建议落点（按应用册微调；词根不变）
features/infer/ # 或 features/<业务推理名>/ — 业务能力词根
 <use-case>/ # 例：classify-ticket、embed-document
 authorize.ts|py # 薄：调 06 语义（可内联）
 validate.py
 infer.py # 编排 Lifecycle；禁 InferenceManager
internal/inference/ # 或 src/shared/inference/ — 基础设施名允许
 runtime.py # InferenceRuntime 端口 + 一家适配器
 quota.py
 model_registry.py # 解析 model_id + artifact_version（非训练 registry 百科）
artifacts/ # 或外部 URI；仓内仅 stub/fixture
 <model_id>/<artifact_version>/
 model.onnx # 例；真权重可不入库，CI 用 stub
 MANIFEST.json # digest、框架、输入名
ops/
 inference.md # 可选：滚动与版本切换（非 APM 必勾）
tests/
 inference/
 lifecycle_test.py
 quota_timeout_test.py
```

依赖方向：`features/<业务> → inference 编排 → runtime + quota`；**禁**路由 handler 内直接散落 `ort.InferenceSession` / `torch.load` 且无 Lifecycle 步骤。 
Artifact SSOT：`04` + INPUTS；禁平行「实验名」覆盖生产版本。 
HTTP 契约 SSOT：`03` + templates；禁第二份错误码表分叉。

UI 状态矩阵：若产品暴露「推理中/失败/超时」，状态名必须用 Pass1 词表（与 `08` 一致）。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建或更新 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。 
2. **`model_id`、推理用例、错误码** = 业务词根（`ticket.classify`、`doc.embed`），禁 `model1`、`run_ml`、`doPredict`。 
3. **禁**技术翻译名进领域模块主名：`*InferenceManager`、`*MlService`、`*PredictorHelper`、`handleInfer*`、`processBatch*`（基础设施可用 `InferenceRuntime` / `QuotaLimiter` 入口例外）。 
4. **禁**同义词分叉：`infer`/`predict`/`score`/`forward` 词表只留一个（本册默认 **`infer`**）；授权用 **`authorize`**；校验用 **`validate`**；超时用 **`timeout`**；配额用 **`quota`**。 
5. 对外若暴露 `request_id` / `model_id` / `artifact_version` 字段，协议名冻结在词表。

| 概念 | 正例 | 反例 |
|------|------|------|
| 模型身份 | `ticket.classify` + `1.2.0` / `sha256:…` | `latest`、`model_a_final2` |
| 操作 | `authorize`、`validate`、`infer` | `handlePredict`、`processMl`、`doScore` |
| 配额 | `quota`、`in_flight`、`rate_limit` | `throttle_tmp`、`limit_flag` |
| 错误 | `inference.timeout`、`inference.validation_failed` | `err_ml`、`fail2`、`ok_false` |
| Artifact | `artifact_version`、`manifest` | `weights_blob`、`pkl_path` 作对外主名 |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| model_id | `dot` 或 `kebab` 分段；全文一种 |
| artifact_version | semver `X.Y.Z` **或** `sha256:` 前缀 digest；全文一种策略 |
| 环境变量 | `MODEL_ID`、`ARTIFACT_VERSION`、`INFERENCE_TIMEOUT_SECONDS`、`INFERENCE_MAX_IN_FLIGHT`、`INFERENCE_RATE_PER_MINUTE`、`INFERENCE_API_KEY`（或 INPUTS 约定名称） |
| 路由 | `/v1/infer` 或 `/v1/models/{model_id}/infer`（多模型时）；全文一种 |
| Python | 模块 `snake_case`；跟 fastapi 册 |
