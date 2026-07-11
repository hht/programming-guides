# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写鉴权实现**。 
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL/字段表/P0）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **鉴权模式（互斥勾选一）** | □ **A. Cookie 会话 only** □ **B. Cookie 会话 + OAuth/OIDC** □ **C. OAuth/OIDC 登录 + Cookie 会话**（名称强调：IdP 登录后**仍**签发本应用 Cookie；禁 Implicit；禁「无 Cookie 的纯 OIDC SPA」） □ **D. API/机器 JWT only** |
| 2 | **登录/会话 UI 或 API 态** | □ 有 UI：须列 screen/frame：`login` / `logout` / `session-expired`（或等价名）+ 主 CTA □ 纯 API：写 `N/A — 仅 HTTP 401/204` |
| 3 | **Cookie 名** | 默认 **`session`**；改则写明（全栈唯一）。模式 D → `N/A` |
| 4 | **Cookie 属性** | 模式 A/B/C：`HttpOnly=true`；staging/prod `Secure=true`；`SameSite` 默认 `Lax`；`Path=/`；TTL 与 §6 对齐。模式 D → `N/A` |
| 5 | **会话存储** | □ Postgres（默认；对齐 [templates/session.schema.json](./templates/session.schema.json)） □ Redis（须同时勾选并遵守 [docs/redis](../redis/README.md) `08`；否则必须 PG）。模式 D 若无服务端会话 → 书面 |
| 6 | **会话 TTL** | idle 秒 + absolute 秒（默认建议 7d / 30d）。模式 D 无会话 → JWT `exp` 数字 |
| 7 | **token_hash 算法** | 默认 **SHA-256**（pepper=`SESSION_SECRET`）；改则写算法名 |
| 8 | **登录方式** | 须与 §1 一致：模式 A → 至少一种凭证；B/C → OAuth provider 表（issuer、client_id、redirect_uri、scopes）± 凭证；D → 机器凭证/签发流程 |
| 9 | **OAuth client** | 仅 §1=B/C：staging/prod 成对 client_id/secret（或公钥客户端）、issuer、redirect_uri；**PKCE 强制**；禁 Implicit。A/D → `N/A` |
| 10 | **环境成对** | staging/prod：`APP_ENV`、`SESSION_SECRET`（或 JWT 签名密钥）、会话/`DATABASE_URL`（若用 PG）；**值不入库** |
| 11 | **错误码表** | 至少：`UNAUTHENTICATED` / `SESSION_EXPIRED` / `SESSION_INVALID` / `FORBIDDEN` / `CSRF_FAILED`（模式 D 可无 CSRF）→ HTTP status；可扩 `STORE_UNAVAILABLE` |
| 12 | **受保护策略** | API 未登录 → **401**；浏览器页 → **redirect**（默认 `/login`）；**禁止假成功 200** |
| 13 | **CSRF** | 模式 A/B/C 写操作：默认双重提交（见 `07`）或写明 SameSite 严格策略。模式 D → `N/A` |
| 14 | **应用册对接** | □ nextjs □ react □ go □ fastapi □ 多册（列清单）— 本册为鉴权 SSOT（`08`） |
| 15 | **IdP** | □ 无（自管） □ Ory Kratos（可选） □ 其它（须写明 issuer+JWKS URL；**禁止** Keycloak 唯一默认） |

## 若适用

| # | 项 |
|---|-----|
| 16 | CORS origin 白名单（staging/prod） |
| 17 | 模式 D：JWT issuer/audience/alg；禁 localStorage 浏览器主会话 |
| 18 | 多设备会话 / 登出范围 |
| 19 | 密码策略（凭证登录时） |

## 模式裁剪

| 模式 | 必读章 | 可 N/A |
|------|--------|--------|
| A | 03、05、07；04 仅凭证节 | 04 OAuth、06 JWT 主路径 |
| B/C | 03、04、05、07 | 06 浏览器 JWT |
| D | 06、05（Bearer Gate 变体） | 03 Cookie、07 CSRF、04 OAuth（除非机器 OAuth） |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
