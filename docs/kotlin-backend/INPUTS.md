# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写业务路由**。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **身份** | Gradle `rootProject.name`、主包名（例 `com.org.api`）、服务名、公开 Base URL（staging/prod） |
| 2 | **OpenAPI 3.x** | 落盘仓根 **`openapi.yaml`**；主资源 CRUD + 错误 shape；若鉴权≠无：须含 `components.securitySchemes` + 受保护 operation 的 `security` |
| 3 | **主写用例** | 一条用户可感知写操作（创建/更新/删除名 + 成功 status + 响应字段）；多语句/多表写：□ 是 □ 否（影响 `09` #6） |
| 4 | **数据模型** | 表/字段/约束；Postgres 版本下限；若 Session：须含 `users(id, username unique, password_hash)` 与 `sessions(id text PK, subject text NOT NULL, expires_at timestamptz NOT NULL, csrf_token text NOT NULL)` |
| 5 | **环境变量** | 至少 `APP_ENV`、`HTTP_ADDR`、`DATABASE_URL`（staging/prod 成对）；JWT/IdP 另须 `JWT_ISSUER`+`JWT_AUDIENCE` 及密钥/JWKS/introspection 相关键（见 `env.example`） |
| 6 | **鉴权** | **四选一**（互斥）：□ 无鉴权（仅内网） □ Bearer JWT（issuer/audience；HMAC→`JWT_SECRET`+默认 alg **HS256**，或 RS256+`JWT_PUBLIC_KEY_PEM`；**`sub`→`call.attributes[SubjectKey]`**） □ Session cookie（cookie 名；**HttpOnly=true**；**Secure**=`APP_ENV!=development`；**Path=/**；**Max-Age** 对齐 `expires_at`；**SameSite 默认 Lax**；表默认 `sessions(...)`；CSRF 见 `07`） □ 外部 IdP（须写明 JWKS **或** introspection 二选一 + issuer + 凭证；**`sub`→SubjectKey**） |
| 7 | **错误码表** | 默认可勾选沿用 `04` 映射表；若自定义须列 code→HTTP；响应 shape 必须符合 [templates/error-response.schema.json](./templates/error-response.schema.json) |
| 8 | **幂等** | □ 不要 □ 要：请求头 **`Idempotency-Key`**；表 `idempotency_keys(key text PK, response_status int NOT NULL, response_body text NOT NULL, created_at timestamptz NOT NULL)`；`key`=SHA-256 hex（见 `05`）；TTL 默认 **24h**；勾「要」则 §3 主写**必须**幂等 |

## 若适用

| # | 项 |
|---|-----|
| 9 | 文件/对象存储 |
| 10 | 出站 Webhook / 队列 |
| 11 | 多租户：租户键从何而来 |
| 12 | CORS：浏览器跨域时 origin 白名单（默认同站不开） |

## 门闸

```text
INPUTS OK
```

或 `INPUTS BLOCKED:` + 列表。
