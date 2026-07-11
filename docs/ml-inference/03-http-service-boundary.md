# 03 — HTTP 推理服务边界

## 不变量

- 本册默认交付面 = **同步 HTTP JSON 推理 API**（流式仅 INPUTS §14）。 
- 边界内：鉴权、校验、配额、超时、调用 runtime、结构化响应。 
- 边界外（禁止当必做正文）：训练 job、数据集版本百科、特征商店、实验 UI、集群 GPU 调度百科。 
- 每个成功响应必须回显（或可追溯）所用 **`model_id` + `artifact_version`**，防止静默跑错版本。

## 默认端点

| 项 | 默认 | 说明 |
|----|------|------|
| Method / Path | `POST /v1/infer` | 多模型时用 `/v1/models/{model_id}/infer`（INPUTS §16） |
| Content-Type | `application/json` | 其它 MIME 须白名单 |
| 认证 | Bearer / API key | 见 INPUTS §2 |
| 幂等 | 默认**不**要求幂等键 | 推理常非确定性；若产品要去重须在 INPUTS 写明 + 键语义 |

## 请求 / 响应契约（种子）

**InferenceRequest**（字段名冻结；扩展须改契约）：

| 字段 | 必填 | 说明 |
|------|------|------|
| `input` | 是 | 业务载荷（对象/数组/字符串按 schema） |
| `model_id` | 多模型时是 | 单模型部署可省略，服务端用配置 |
| `request_id` | 否 | 调用方追踪；缺则服务端生成 UUID |
| `params` | 否 | 白名单推理参数（temperature 等）；未知键 → validation_failed |

**InferenceResponse（成功）**：

| 字段 | 必填 | 说明 |
|------|------|------|
| `request_id` | 是 | |
| `model_id` | 是 | 实际所用 |
| `artifact_version` | 是 | 实际所用 |
| `output` | 是 | 业务结果 |
| `latency_ms` | 宜 | 服务端观测；非运维第三方必勾 |

Schema 例：[templates/inference-request.schema.json](./templates/inference-request.schema.json)、[inference-response.schema.json](./templates/inference-response.schema.json)。

## 与应用册边界

| 职责 | Owner |
|------|--------|
| 会话登录 / OAuth | [auth](../auth/README.md)（若对接） |
| HTTP 框架惯例 | [fastapi](../fastapi/README.md) |
| 推理 Lifecycle / 版本 / 超时配额 | **本册** |

## 失败分类（边界层）

| 情况 | 码 |
|------|-----|
| 非 JSON / 错 Content-Type | `inference.validation_failed` |
| Body > max bytes | `inference.payload_too_large` |
| 路径 model_id ≠ 已加载且不允许 | `inference.model_mismatch` |
| 方法不允许 | 框架 405；不进 Lifecycle |

## 单测探针

| case | 期望 |
|------|------|
| GET /v1/infer | 非 200 推理成功 |
| 超大 body | `payload_too_large`；不调 runtime |
| 成功响应缺 artifact_version | 契约/测试红灯 |
