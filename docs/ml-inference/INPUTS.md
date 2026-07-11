# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写推理 HTTP 路由 / runtime 适配 / 配额实现**。 
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL / digest / 路径）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **HTTP 入口** | 路径（例 `POST /v1/infer`）+ OpenAPI/契约文件路径；staging/prod **成对** base URL 名（值可环境注入） |
| 2 | **鉴权策略（互斥任选一种）** | □ **Bearer / API key**（头名须写明，默认 `Authorization: Bearer`）□ **mTLS** □ **内网 + 网关已验**（写明：谁验、本服务是否再验）□ **其它**（理由 + 文档 URL）— **禁止**「可匿名公开推理」作默认；若产品要公开须写明，并附 单独配额硬顶 |
| 3 | **`model_id` + `artifact_version`** | 生产加载目标写明：`model_id`（业务名）+ `artifact_version`（**semver 或 content digest**，二选一策略全文统一）；**禁止**仅 `latest` 且无冻结 digest 作生产唯一选择 |
| 4 | **Artifact 存放** | □ 本地路径 □ 对象存储 URI □ 模型仓库 URI — staging/prod 成对；校验方式写明：□ sha256 □ 签名 □ 仓库不可变 tag |
| 5 | **InferenceRuntime（互斥任选一家）** | □ **ONNX Runtime** □ **PyTorch** □ **vLLM** □ **Triton client** □ **其它**（理由 + 官方文档 URL）— **禁止**双 runtime 同为 SSOT；可换适配器，Lifecycle 语义不随 runtime 分叉 |
| 6 | **输入契约** | ≥1 个 `InferenceRequest` schema（字段、类型、必填、最大尺寸）；与 [templates/inference-request.schema.json](./templates/inference-request.schema.json) 对齐或写明差分 |
| 7 | **输出契约** | `InferenceResponse` 成功形状 + 错误码表（至少含下表默认码）；与 [templates/inference-response.schema.json](./templates/inference-response.schema.json) 对齐或写明差分 |
| 8 | **请求超时** | 墙钟超时秒数（默认 **30**；LLM 可明确上调到 ≤**300**）；超时行为写明：□ 取消 in-flight（默认）□ 尽最大努力返回部分（仅流式且须写明） |
| 9 | **配额** | 同时写明：① **并发 in-flight / 主体**（默认 **4**）② **速率**（默认 **60 req/min / 主体**）— 超限码 `inference.quota_exceeded`；配额维度 □ `principal_id` □ `api_key_id` □ `tenant_id`（与鉴权主体一致） |
| 10 | **载荷上限** | 请求 body 最大字节（默认 **1 MiB**；多模态可明确上调并约定 MIME 白名单）；超限 → `inference.payload_too_large` |
| 11 | **错误码表** | 至少：`inference.unauthorized` / `inference.forbidden` / `inference.validation_failed` / `inference.quota_exceeded` / `inference.timeout` / `inference.unavailable` / `inference.model_mismatch` / `inference.internal` → HTTP 映射（见 `08`） |
| 12 | **环境成对** | staging/prod：`APP_ENV`、鉴权密钥名、`MODEL_ID`、`ARTIFACT_VERSION`、`INFERENCE_TIMEOUT_SECONDS`、配额数字、runtime 相关路径/URI 名；**值不入库** |
| 13 | **应用册对接** | □ fastapi（默认同栈）□ go □ rust-api □ 多册 — 本册为 **Inference Request Lifecycle** SSOT |

## 若适用

| # | 项 | 何时 |
|---|-----|------|
| 14 | **流式响应** | □ 不做（默认；同步 JSON）□ 做：须写明 SSE/chunk 契约 + 超时仍取消 + 部分结果是否可见 |
| 15 | **批推理** | □ 不做（默认；单样本/单请求）□ 做：batch 大小硬顶（默认 **32**）+ 校验与配额按 batch 计 |
| 16 | **多模型路由** | □ 单模型（默认）□ 多模型：请求必带 `model_id`；每个 id 仍约定 `artifact_version`；禁默默 fallback 到另一版本 |
| 17 | **GPU / 设备** | 设备选择须写明（`cpu` / `cuda:N`）；OOM → `inference.unavailable`，禁裸 500 无码 |
| 18 | **对接 auth / saas** | 若主体来自会话/租户：另满足 [auth](../auth/README.md) / [saas](../saas/README.md) INPUTS 适用项；本册不另造登录 |
| 19 | **禁止清单确认** | 勾选：□ **不**在指南/实现把训练循环当本册范围；□ **不**生产仅靠 `latest`；□ **不**跳过 authorize 直接 infer；□ **不**无超时无配额上线 |

## 裁剪

| 选项 | 必读章 | 可 N/A |
|------|--------|--------|
| 默认同步 JSON | 03–08 | 流式节细节 |
| 流式 | 08 流式节 + INPUTS §14 | — |
| 单模型 | 04 单版本表 | 多模型路由 |
| 多模型 | 04 + INPUTS §16 | — |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
