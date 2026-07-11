# 07 — 超时、重试与幂等

## 不变量

- **TIMEOUT** 对调用方可感知（默认 HTTP 504 + code `TIMEOUT`）。  
- **写路径**必填幂等维度；冲突默认 **reject**。  
- HTTP 同步默认 **不**由平台自动重试业务；异步按 `max_attempts` + 退避。  
- 投递语义默认 **at-least-once**（异步）；禁止无幂等宣称 exactly-once。

## 步骤规格（实现自写）

### 1. 超时

1. 读取 INPUTS 墙钟数字；与平台 hard limit 取更紧者。  
2. Handler / 下游使用同一 deadline。  
3. 触发时：中断 → `TIMEOUT`；**不** ack 异步消息为成功（若适用）。

### 2. 幂等（写）

1. 键来源：HTTP header **`Idempotency-Key`**（默认）或触发表钉死的业务字段。  
2. 长度默认 **1–128** 可打印 ASCII；超限 → `VALIDATION`。  
3. 存储：按平台选 KV / D1 / DB / 上游权威源 **一处 SSOT**；记录 status+body 指纹或业务结果句柄。  
4. 同键重放：返回与首次成功 **等价**响应；副作用计数不增加。  
5. 冲突策略默认 **reject**（进行中的并发同键 → `CONFLICT` 或排队等到首次完成 — INPUTS 钉一；默认 **reject**）。

### 3. 重试

| 触发 | 默认 |
|------|------|
| HTTP 同步 | 不自动重试；调用方重试依赖幂等 |
| cron / queue / Lambda 异步 | `max_attempts` 默认 **5**；指数退避 `base=1s` `cap=900s` |
| permanent（VALIDATION 等） | 不重试 |

### 4. 失败分类（handler → retry 判定）

| 分类 | 例 | 异步行为 |
|------|-----|----------|
| transient | 下游 503、超时、网络 | retry 直至上限 |
| permanent | 校验失败、404 业务拒绝 | 不重试 |
| unknown | 未分类 | **默认按 transient**（最多到上限）；INPUTS 可改为 fail-closed |

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 写缺幂等键 | VALIDATION |
| 同键成功重放 | 200（或首次 status）+ 无二次副作用 |
| 超时 | TIMEOUT |
| 异步超限 | 死信/失败面可查或可告警（APM 非必勾） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 缺 Idempotency-Key（写） | VALIDATION |
| 同键两次 POST | 副作用 ×1 |
| 模拟 504/TIMEOUT | 非 2xx；code=TIMEOUT |
| transient × max_attempts | 停止重试 |
| permanent | 立即失败；attempt 不爬满 |
