# 00 — 原则与不变量

## 品类

用户通过**会话 Cookie 和/或 OAuth/OIDC**完成登录；受保护请求在验会话后注入身份，失败 fail-closed。

## 核心正确性路径（全文唯一）

**Session Gate Lifecycle**：请求 → 读会话凭证 → 校验有效性 → 注入 subject → 授权 → 放行/拒绝。规格见 [05](./05-session-gate-lifecycle.md)。

## 硬不变量

1. **Web 第一方默认**：Opaque server-side session + Cookie（`HttpOnly`+`Secure`+`SameSite`）；名默认 `session`。  
2. **禁明文 token 落库**：只存 `hash(token)`（或库认可的单向摘要）；pepper/`SESSION_SECRET` 仅 env。  
3. **浏览器禁止**把 JWT 当主会话放 **localStorage**（见 `06`）。  
4. **Session Gate 失败**：API → **401**；浏览器页 → **redirect** 登录；**禁止假成功**（200 + 空身份冒充已登录）。  
5. **OAuth/OIDC**：仅 Authorization Code + **PKCE**；**禁 Implicit**。  
6. **fail-closed**：缺票、坏票、过期、哈希不匹配、存储不可达且无法证明有效 → 未认证。  
7. **本册 = 鉴权 SSOT**：应用册（react/nextjs/go/fastapi）引用本册，不平行发明第二套会话语义。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 鉴权模式 / Cookie 名 / TTL / OAuth client | `INPUTS.md` |
| 会话字段形状 | `templates/session.schema.json` + 迁移 |
| Session Gate 步骤与失败码 | `05-session-gate-lifecycle.md` |
| CSRF / CORS 默认 | `07-csrf-cors-security.md` |
| 与应用框架接线 | `08-cross-app-boundary.md` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（本册 Pass1 种子见 `02`） |

## 禁止

- 指南仓堆可运行业务登录页 / 完整 IdP  
- Keycloak 钉死为唯一默认 IdP  
- Implicit grant、Resource Owner Password 作默认  
- 未登录却返回「成功」业务体  
