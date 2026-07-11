# 08 — 响应、密钥与绑定

## 不变量

- 对外错误形稳定：至少 `code` + `message`（JSON）；`INTERNAL` 对外 message 采用 **`internal error`**。 
- Secrets **不**进源码、**不**进成功/错误响应、**不**进 CI 日志明文。 
- 绑定 / env 名 staging/prod 成对；缺必填 → fail-closed。

## 步骤规格（实现自写）

### 1. 成功响应

1. `Content-Type: application/json`（二进制/流另行约定 INPUTS）。 
2. Status 来自用例；body 字段名 ∈ 词表。 
3. 可选：响应头回显 `Idempotency-Key` / `X-Request-ID`（若启用）。

### 2. 错误映射（默认）

| code | HTTP |
|------|------|
| VALIDATION | 400 |
| UNAUTHORIZED | 401 |
| NOT_FOUND | 404 |
| CONFLICT | 409 |
| TIMEOUT | 504 |
| INTERNAL | 500 |

### 3. 密钥

1. Workers：`wrangler secret` / dashboard；本地 `.dev.vars` **不入库**（gitignore）。 
2. OpenNext/Vercel：托管 Env；Lambda：环境变量 / Secrets Manager（值不入库）。 
3. 读取经 `shared/env` 校验；缺键启动或首请求失败。

### 4. 绑定（Workers）

1. INPUTS §11 表：绑定名 → 资源类型 → 用途。 
2. 类型进 `Env` interface；业务只依赖接口，不依赖控制台点击记忆。 
3. 无绑定产品勾「无绑定」。

### 5. 可观测（参考）

- 结构化日志字段：`request_id`、`invocation_state`、`route`、`code`。 
- Sentry / 商业 APM：**参考**；不进 `11` 必勾。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 缺 secret | fail-closed |
| 未捕获异常 | INTERNAL + internal error |
| 响应含 secret 子串 | 测试/审查红灯 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| VALIDATION | 400 + code |
| panic/throw | 500 + INTERNAL + message=internal error |
| 缺 SECRET | 非成功 |
| 成功 body | 无 secret 名/值 |
