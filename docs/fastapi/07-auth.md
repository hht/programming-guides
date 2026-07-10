# 07 — 鉴权

## 不变量

- INPUTS §6 **四选一**；无鉴权须在 acceptance 声明仅内网  
- 密钥只来自 env  

## 步骤规格

### 无鉴权

无 `get_current_subject`。

### Bearer JWT

1. 读 `Authorization: Bearer`；缺/坏 → 401。  
2. **PyJWT** 校验：`JWT_ISSUER`、`JWT_AUDIENCE`、`exp`；HS256+`JWT_SECRET` 或 RS256+`JWT_PUBLIC_KEY_PEM`。  
3. `request.state.subject = str(payload["sub"])`；缺 `sub` → 401。  
4. OpenAPI scheme：`bearerAuth`。

### Session cookie

1. 路径默认 `POST /v1/auth/login`、`POST /v1/auth/logout`。  
2. Cookie 名：env **`SESSION_COOKIE_NAME`**（默认 `sid`）。属性：HttpOnly=true；Secure=(APP_ENV!="development")；Path=/；SameSite=Lax；Max-Age 对齐 expires_at。  
3. **登录**：body `{username, password}`；用户表须在 INPUTS §4（至少 `users(id, username unique, password_hash)`）；用 **argon2-cffi** `PasswordHasher().verify`；失败 → 401；成功写 `sessions`、Set-Cookie、非 HttpOnly `csrf_token` cookie、JSON `csrf_token`。会话 TTL 默认 **7d**。  
4. **依赖**：读 cookie → 查 sessions；过期→401；`request.state.subject = row.subject`。  
5. **CSRF**：`POST|PUT|PATCH|DELETE` 头 **`X-CSRF-Token`** 必须等于行内 `csrf_token`；否则 403。  
6. **登出**：删会话；清 cookie。  

依赖：`uv add argon2-cffi`（仅 Session 时）。

### 外部 IdP

1. INPUTS 钉 JWKS **或** introspection（互斥）。  
2. **JWKS**：`httpx` GET `IDP_JWKS_URL`；缓存 **3600s**；PyJWT 选 key 验签；校验 `JWT_ISSUER`/`JWT_AUDIENCE`/`exp`；`sub`→subject；失败 401。  
3. **Introspection**：POST `IDP_INTROSPECTION_URL`，body `token=...`，Basic 或 form client_id/secret（`IDP_CLIENT_ID`/`IDP_CLIENT_SECRET`）；`active!=true` → 401；`sub`→subject。  
4. scheme：`bearerAuth`。

## 单测探针

| case | 期望 |
|------|------|
| 无票 | 401 |
| 过期 JWT | 401 |
| Session 写缺 CSRF | 403 |
| 登录错密 | 401 |
