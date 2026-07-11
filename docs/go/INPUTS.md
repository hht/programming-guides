# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写业务 handler**。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **身份** | module path（例 `github.com/org/api`）、服务名、公开 Base URL（staging/prod） |
| 2 | **OpenAPI 3.x** | 落盘仓根 **`openapi.yaml`**；主资源 CRUD + 错误 shape；若鉴权≠无：须含 `components.securitySchemes` + 受保护 operation 的 `security` | 
| 3 | **主写用例** | 一条用户可感知写操作（创建/更新/删除名 + 成功 status + 响应字段） | 
| 4 | **数据模型** | 表/字段/约束；Postgres 版本下限 | 
| 5 | **环境变量** | 至少 `APP_ENV`、`HTTP_ADDR`、`DATABASE_URL`；成对 staging/prod | 
| 6 | **鉴权** | **四选一**（互斥）：□ 无鉴权（仅内网） □ Bearer JWT（issuer/audience；HMAC→`JWT_SECRET`+默认 alg **HS256**，或 RS256+`JWT_PUBLIC_KEY_PEM`；**`sub`→`ctxKeySubject`**） □ Session cookie（cookie 名；**HttpOnly=true**；**Secure**=`APP_ENV!=development`；**Path=/**；**Max-Age** 对齐 `expires_at`；**SameSite 默认 Lax**；表默认 `sessions(id PK text, subject text NOT NULL, expires_at timestamptz NOT NULL, csrf_token text NOT NULL)`；CSRF 见 `07`） □ 外部 IdP（须勾 **JWKS** 或 **introspection** 二选一；issuer；凭证。**env 键冻结**：`IDP_ISSUER`；JWKS→`IDP_JWKS_URL`；introspection→`IDP_INTROSPECTION_URL`+`IDP_CLIENT_ID`+`IDP_CLIENT_SECRET`；**`sub`→`ctxKeySubject`**） |
| 7 | **错误码表** | 默认可勾选沿用 `04` 映射表；若自定义须列 code→HTTP；响应 shape 必须符合 [templates/error-response.schema.json](./templates/error-response.schema.json) | 
| 8 | **幂等** | □ 不要 □ 要：请求头 **`Idempotency-Key`**；表 `idempotency_keys(key PK, response_status int, response_body bytea, created_at timestamptz)`（`response_body`=首次响应 JSON **原始字节**，禁 jsonb 以免规范化破坏字节回放）；TTL 默认 **24h** | 

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
