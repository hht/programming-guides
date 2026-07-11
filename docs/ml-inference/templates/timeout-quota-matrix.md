# Timeout × Quota 默认矩阵

> 实现仓可改数字，但须写入 INPUTS；码名冻结。

| 条件 | 行为 | code | HTTP |
|------|------|------|------|
| in-flight &lt; max 且 rate ok 且耗时 ≤ timeout | 成功 respond | — | 200 |
| in-flight ≥ max（默认 4） | 拒绝；不 infer | `inference.quota_exceeded` | 429 |
| rate &gt; max/min（默认 60） | 拒绝；不 infer | `inference.quota_exceeded` | 429 |
| 已 authorize+validate，runtime &gt; timeout（默认 30s） | 取消；无成功 output | `inference.timeout` | 504 |
| 超时与配额同时可能 | 先发生者生效；超时前已 429 则不进 infer | 分码 | — |
| 校验失败 | 释放槽；非 timeout | `inference.validation_failed` 等 | 4xx |

## 默认值速查

| 键 | 默认 |
|----|------|
| `INFERENCE_TIMEOUT_SECONDS` | 30 |
| `INFERENCE_MAX_IN_FLIGHT` | 4 |
| `INFERENCE_RATE_PER_MINUTE` | 60 |
| `INFERENCE_MAX_BODY_BYTES` | 1048576 (1 MiB) |
