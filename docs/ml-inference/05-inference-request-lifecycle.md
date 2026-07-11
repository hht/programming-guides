# 05 — Inference Request Lifecycle（核心）

## 不变量

- 全文唯一核心路径名：**Inference Request Lifecycle**。  
- 顺序钉死（**不可跳步、不可调换 1↔2、2↔3**）：

```text
1 authorize → 2 validate input → 3 infer → 4 respond / timeout
```

- 步骤 4 的 `timeout` 与 `respond` 为**同一出口阶段**的互斥结果：要么在时限内成功/业务错误响应，要么超时错误；禁止「超时后仍当成功」。  
- 超越：① authorize 硬门闸 + 未授权探针；② 超时与配额分码 + 发版矩阵。

## 步骤规格（实现自写）

### 1. Authorize

1. 解析认证主体（Bearer / API key / mTLS / 网关已验 — INPUTS §2）。  
2. 未通过 → **`inference.unauthorized` 或 `inference.forbidden`**；**停止**；不读完整业务 input 做重计算、不调 runtime。  
3. 通过 → 绑定 `principal_id`（或等价）。  
4. **配额预检 / 占位**：按 [06](./06-authorize-and-quota.md) 尝试获取 in-flight 槽位与速率令牌；失败 → `inference.quota_exceeded`；成功则持有槽位至步骤 4 结束（finally 释放）。  
5. （可选）核对请求 `model_id` 是否对该主体允许；不允许 → `forbidden`。

### 2. Validate input

1. 解析 JSON → 对照 schema（[07](./07-validate-input.md)）。  
2. 校验载荷大小、必填字段、类型、数值范围、白名单 `params`、batch 上限（若启用）。  
3. 若请求含 `artifact_version` / `model_id`：与已加载集合比对；不匹配 → `inference.model_mismatch`。  
4. 任一失败 → 对应 4xx 码；**释放配额槽**；不进步骤 3。  
5. 输出：`ValidatedInferRequest`（规范化后的 input + 解析后的 model 身份 + request_id）。

### 3. Infer

1. 在墙钟超时预算内调用 `InferenceRuntime.infer(validated)`（[08](./08-timeout-respond-errors.md)）。  
2. Runtime 瞬时故障 → 可有限次重试（默认 **0** 次；INPUTS 书面才 >0）；耗尽 → `inference.unavailable`。  
3. OOM / 后端断开 → `unavailable`；禁止未映射异常冒泡成无码 500。  
4. 成功 → 得到原始 `output`（尚未包装 HTTP）。

### 4. Respond / timeout

1. **Timeout**：若步骤 3 超过 `INFERENCE_TIMEOUT_SECONDS`（默认 **30**）→ 取消/放弃 in-flight → **`inference.timeout`**；响应不得带部分 `output`（除非 INPUTS §14 流式书面允许）。  
2. **Respond**：包装 `InferenceResponse`：`request_id`、`model_id`、`artifact_version`、`output`、（宜）`latency_ms`。  
3. finally：释放配额槽。  
4. 日志/度量可记码与耗时（运维第三方**不进**必勾）。

## 伪代码（规格级，非业务实现）

```text
function handleInfer(raw, credentials):
  principal = authorize(credentials)          # 1
  if principal.denied: return unauthorized|forbidden
  slot = quota.acquire(principal)
  if not slot: return quota_exceeded
  try:
    validated = validate(raw, loaded_models)  # 2
    if validated.invalid: return validation|mismatch|too_large
    result = with_timeout(timeout_s,           # 3+4
      lambda: runtime.infer(validated))
    if result.timed_out: return timeout
    if result.unavailable: return unavailable
    return respond(ok, validated, result.output)  # 4
  finally:
    quota.release(slot)
```

## 失败分类 / 默认值

| 情况 | 步骤 | 码 | HTTP（默认） |
|------|------|-----|--------------|
| 缺/错凭证 | 1 | `inference.unauthorized` | 401 |
| 无权限模型 | 1 | `inference.forbidden` | 403 |
| 超配额 | 1 | `inference.quota_exceeded` | 429 |
| Schema/范围失败 | 2 | `inference.validation_failed` | 400 |
| Body 过大 | 2 | `inference.payload_too_large` | 413 |
| 版本不匹配 | 2 | `inference.model_mismatch` | 409 |
| 墙钟超时 | 4 | `inference.timeout` | 504 |
| Runtime 不可用 | 3/4 | `inference.unavailable` | 503 |
| 未分类 | 4 | `inference.internal` | 500 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 无凭证 | 401；`runtime.infer` 调用 = 0 |
| 合法凭证 + 非法 input | 400；`infer` = 0；配额已释放 |
| 超并发 | 429；`infer` = 0 |
| 快乐路径 | 1→2→3→4；响应含钉死 `artifact_version` |
| runtime 睡死超过 timeout | `inference.timeout`；非 200 |
| 步骤顺序调换（架构/单测） | FAIL |
| 校验失败后配额 | 可再次获得槽位（无泄漏） |
