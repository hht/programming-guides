# 07 — 鉴权

## 不变量

- 按 INPUTS §6 **四选一**；「无鉴权」须在 acceptance 声明仅内网 
- 密钥只来自 env；禁进仓 

## 步骤规格

| 策略 | 行为 |
|------|------|
| 无鉴权 | 无 Auth 中间件 |
| Bearer JWT | `jwt/v5`；HS256+`JWT_SECRET` 或 RS256+**`JWT_PUBLIC_KEY_PEM`**（PEM）；校验 iss/aud/exp；缺/坏票→401；**`sub`→`ctxKeySubject`**；OpenAPI scheme 名 **`bearerAuth`** |
| Session cookie | 见下节 |
| 外部 IdP | JWKS 或 introspection（INPUTS）；**`sub`→`ctxKeySubject`**；scheme **`bearerAuth`** |

受保护路由：`r.Group` + Auth（**decode 之前**）。 
`UNAUTHORIZED`=未带票；`FORBIDDEN`=票有效但 CSRF/权限失败。

### Session（勾选时必做）

1. **OpenAPI 必含**：`POST /v1/auth/login`、`POST /v1/auth/logout`（路径可改但须在 INPUTS/OpenAPI 写明）；`securitySchemes.sessionCookie`（cookie）+ 写操作参数头 `X-CSRF-Token`。 
2. **登录成功**：插入 `sessions`；Set-Cookie 会话（HttpOnly/Secure/Path/Max-Age/SameSite 见 INPUTS）；另设 **非 HttpOnly** cookie 名 **`csrf_token`**=同列值（供前端读后填头）；响应 JSON 亦含 `"csrf_token"`。 
3. **鉴权中间件**：读会话 cookie→查表；过期→401；对 **写方法** `POST|PUT|PATCH|DELETE`：头 `X-CSRF-Token` 必须等于行内 `csrf_token`，否则 **FORBIDDEN**。 
4. **登出**：删会话行；清两 cookie。 

## 单测探针

| case | 期望 |
|------|------|
| 无票访受保护 | 401 |
| 过期 JWT | 401 |
| Session 写缺 CSRF | 403 FORBIDDEN |
| 有效票 | 进入 handler |
