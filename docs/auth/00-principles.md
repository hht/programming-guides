# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：随宿主应用册 Language Gate（本册不另开语言百科；实现语言的 fmt/lint 跟宿主 `commands`）。

## 品类

用户通过**会话 Cookie 和/或 OAuth/OIDC**完成登录；受保护请求在验会话后注入身份，失败 fail-closed。

## 核心正确性路径（全文唯一）

**Session Gate Lifecycle**：请求 → 读会话凭证 → 校验有效性 → 注入 subject → 授权 → 放行/拒绝。规格见 [05](./05-session-gate-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | Web 第一方默认：Opaque server-side session + Cookie（HttpOnly+Secure+SameSite）；名默认 `session` | `03`/`05` |
| F02 | MUST NOT | 明文 token 落库；只存 hash(token) | schema 抽检 |
| F03 | MUST NOT | 把 JWT 当主会话放 localStorage | `06` |
| F04 | MUST | Gate 失败：API → 401；页 → redirect 登录 | e2e |
| F05 | MUST NOT | 假成功（200 + 空身份冒充已登录） | 同上 |
| F06 | MUST | OAuth/OIDC 仅 Authorization Code + PKCE | `08` |
| F07 | MUST NOT | Implicit Grant | 同上 |
| F08 | MUST | fail-closed：缺/坏/过期票或存储不可达 → 未认证 | `05` |
| F09 | MUST | 本册为鉴权 SSOT | 边界 |

## SSOT

| 真相 | Owner |
|------|--------|
| 鉴权模式 / Cookie 名 / TTL / OAuth client | `INPUTS.md` |
| 会话字段形状 | `templates/session.schema.json` + 迁移 |
| Session Gate 步骤与失败码 | `05-session-gate-lifecycle.md` |
| CSRF / CORS 默认 | `07-csrf-cors-security.md` |
| 与应用框架接线 | `08-cross-app-boundary.md` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止（摘要）

- 指南仓堆可运行业务登录页 / 完整 IdP
- Keycloak 规定为唯一默认 IdP
- Implicit grant、Resource Owner Password 作默认
- 未登录却返回「成功」业务体
