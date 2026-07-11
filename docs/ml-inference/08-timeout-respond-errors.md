# 08 — 超时、响应与错误

## 不变量

- 对应 Lifecycle **步骤 4**（与步骤 3 共享超时预算）。 
- **超时码与成功码互斥**：超时响应不得同时带业务成功 `output`（流式例外仅 INPUTS §14）。 
- 错误响应形状稳定：至少 `code` + `message` + `request_id`；与成功响应可区分。 
- 墙钟超时默认 **30s**（INPUTS §8）；ASGI/代理超时 ≥ 该值或取更严并在 INPUTS 写明。

## Timeout

1. 在调用 runtime 外包 `wait_for(timeout_s)`（或等价）。 
2. 触发后：取消任务（若可）；记 `inference.timeout`；HTTP 默认 **504**。 
3. 超时仍计配额占用至 finally 释放。 
4. 禁止无限挂起的同步 `runtime` 调用而不设超时。

## Respond（成功）

```text
{
 "request_id": "...",
 "model_id": "...",
 "artifact_version": "...",
 "output": { ... },
 "latency_ms": 12
}
```

- `model_id` / `artifact_version` = **实际执行**版本，非调用方臆测。 
- HTTP **200**。

## 错误响应（默认）

```text
{
 "request_id": "...",
 "code": "inference.timeout",
 "message": "human-readable, no secret"
}
```

| code | HTTP |
|------|------|
| `inference.unauthorized` | 401 |
| `inference.forbidden` | 403 |
| `inference.validation_failed` | 400 |
| `inference.payload_too_large` | 413 |
| `inference.quota_exceeded` | 429 |
| `inference.model_mismatch` | 409 |
| `inference.timeout` | 504 |
| `inference.unavailable` | 503 |
| `inference.internal` | 500 |

`message` **禁止**泄露密钥、绝对权重路径、堆栈；堆栈仅日志。

## 流式（仅 INPUTS §14）

- 首字节前仍须跑完 authorize + validate。 
- 超时：关闭流并结束；客户端可见错误帧或截断策略择一写明。 
- 默认册验收以同步 JSON 为准；流式行在 `09` 标「若启用」。

## 单测探针

| case | 期望 |
|------|------|
| fake runtime sleep > timeout | 504 + `inference.timeout`；无成功 output |
| 成功 | 200 + artifact_version 写明值 |
| unavailable | 503 |
| 错误体含 stack | 测试红灯 |
| 超时后配额 | 可再 acquire |
