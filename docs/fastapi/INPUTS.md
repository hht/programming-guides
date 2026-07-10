# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写业务路由**。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **身份** | 发行名（pyproject `name`）与导入包 **固定为 `app`**（目录 `app/`）；服务名；Base URL staging/prod |
| 2 | **OpenAPI / 端点契约** | 开工前：①`openapi.yaml` **或** ②端点表（列：method, path, request, response, **auth: public\|bearer\|session**）。实现后提交 **`openapi.json`** 为 SSOT；开工 yaml/表可留作设计稿，CI 以 json 为准 |
| 3 | **主写用例** | 名 + 成功 status + 响应字段；多语句/多表写：□ 是 □ 否（影响 `09` #6） |
| 4 | **数据模型** | 表/字段/约束；Postgres 版本下限；若 Session：须含 `users(id, username unique, password_hash)` 与 `sessions(id text PK, subject text NOT NULL, expires_at timestamptz NOT NULL, csrf_token text NOT NULL)` |
| 5 | **环境变量** | 至少 `APP_ENV`、`HTTP_ADDR`、`DATABASE_URL`（staging/prod 成对）；JWT/IdP 另须 `JWT_ISSUER`+`JWT_AUDIENCE` 及密钥/JWKS/introspection 相关键（见 `env.example`） |
| 6 | **鉴权** | **四选一**：□ 无鉴权（仅内网） □ Bearer JWT（§5） □ Session（`SESSION_COOKIE_NAME`；§4 含 users+sessions） □ 外部 IdP（JWKS 或 introspection + §5） |
| 7 | **错误码表** | 默认可勾选沿用 `04`；shape 必须符合 [templates/error-response.schema.json](./templates/error-response.schema.json) |
| 8 | **幂等** | □ 不要（主写无幂等） □ 要：头 **`Idempotency-Key`**；表 **`idempotency_keys(key text PK, response_status int NOT NULL, response_body text NOT NULL, created_at timestamptz NOT NULL)`**；`key`=SHA-256 hex（见 `05`）；TTL **24h**；勾「要」则 §3 主写**必须**幂等 |

## 若适用

| # | 项 |
|---|-----|
| 9 | 文件/对象存储 |
| 10 | 出站 Webhook / 队列 |
| 11 | 多租户：租户键从何而来 |
| 12 | CORS origin 白名单；若反代可旁注「要 ProxyHeaders」 |

## 门闸

```text
INPUTS OK
```

或 `INPUTS BLOCKED:` + 列表。
