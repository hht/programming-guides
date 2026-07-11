# 07 — 校验输入

## 不变量

- 对应 Lifecycle **步骤 2**；仅在 authorize（及配额占位）成功之后。 
- 校验失败 → 4xx；**不**调用 `InferenceRuntime.infer`。 
- Schema 为 SSOT（Pydantic / JSON Schema）；禁 handler 内散落无文档的 `if` 作为唯一校验。

## 校验清单（按序）

1. **传输**：UTF-8 JSON；Content-Type 允许；`Content-Length` ≤ `max_bytes`（默认 **1 MiB**）→ 否则 `payload_too_large`。 
2. **结构**：反序列化到 `InferenceRequest`；缺必填 / 类型错 → `validation_failed`。 
3. **业务范围**：数值范围、枚举、字符串最大长度、数组最大元素数（写入 schema / INPUTS）。 
4. **params 白名单**：未知键 → `validation_failed`（默认严格；禁静默丢弃除非 INPUTS 写明）。 
5. **batch**（若启用）：`len(batch) ≤ max_batch`（默认 **32**）。 
6. **模型身份**：请求中的 `model_id` / `artifact_version` 若出现，必须 ∈ 已加载集合；否则 `model_mismatch`。 
7. **规范化**：输出 `ValidatedInferRequest`（默认值填好、类型稳定），供 runtime 使用。

## 与 runtime 的边界

| 层 | 负责 |
|----|------|
| 本步 | JSON/契约/权限版本匹配/大小 |
| Runtime | 张量 shape 与模型输入名最终一致性；若仍失败 → 映射为 `validation_failed` 或 `unavailable`（形状错偏 validation；后端挂偏 unavailable） |

## 失败分类

| 情况 | 码 |
|------|-----|
| Schema / 范围 / 未知 params | `inference.validation_failed` |
| 超 body | `inference.payload_too_large` |
| 版本/模型不匹配 | `inference.model_mismatch` |

## 单测探针

| case | 期望 |
|------|------|
| 缺 `input` | `validation_failed`；infer=0 |
| body = max+1 | `payload_too_large` |
| 未知 param 键 | `validation_failed` |
| 错误 artifact_version | `model_mismatch` |
| 合法最小 fixture | 进入 infer（可用 fake runtime） |
