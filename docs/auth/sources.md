# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| OWASP Session Management Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html |
| OAuth 2.1 Authorization Framework（IETF draft） | https://datatracker.ietf.org/doc/draft-ietf-oauth-v2-1/ |
| OpenID Connect Core 1.0 | https://openid.net/specs/openid-connect-core-1_0.html |
| MDN Set-Cookie | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie |

## 标杆 B（开源 P1）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [better-auth/better-auth](https://github.com/better-auth/better-auth) | P1 | TS 会话/OAuth 工程形状、插件边界 | 整库当唯一目录圣经 | 会话 + OAuth 登录 |
| B | [ory/kratos](https://github.com/ory/kratos) | P1 | 身份流、会话、自助恢复；可选 IdP 模式 | 强制全家桶运维 | 会话与身份 API |
| C | [supabase/auth](https://github.com/supabase/auth) | P1 | Go 鉴权服务、JWT/会话实践 | 照搬 Supabase 托管 | 登录/会话/OAuth |

## 共有能力切条

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 登录 | ✓ | ✓ | ✓ | 必做 |
| 登出 | ✓ | ✓ | ✓ | 必做 |
| 会话续期/过期 | ✓ | ✓ | ✓ | 必做 |
| OAuth 登录 | ✓ | ✓ | ✓ | **条件必做**：仅 INPUTS §1=B/C；模式 A/D → 可选/N/A（不进该仓必勾） |
| 受保护资源拒绝未登录 | ✓ | ✓ | ✓ | 必做 |
| CSRF 防护（Cookie 写） | ✓ | ✓ | —/映射 OWASP | **条件必做**：模式 A/B/C；模式 D → N/A |

## 差距表

| 缺口 | 来自标杆 | 类型 | 落入文件 | 必做/可选/参考 |
|------|----------|------|----------|----------------|
| Opaque Cookie 会话 + hash 存库 | A,B,C + OWASP | 功能/工程 | `03-sessions-and-cookies.md` | 必做 |
| Auth Code + PKCE；禁 Implicit | A,B,C + OAuth 2.1 | 功能 | `04-credentials-and-oauth.md` | 条件必做（§1=B/C） |
| Session Gate 编号步骤 + 失败分类 | A,B,C | 工程 | `05-session-gate-lifecycle.md` | 必做 |
| 登出与会话撤销 | A,B,C | 功能 | `03` / `05` | 必做 |
| 会话续期/过期 | A,B,C | 功能 | `03` / `05` | 必做 |
| 受保护拒绝未登录（401/redirect） | A,B,C | 功能 | `05` / `09` | 必做/超越 |
| CSRF 防护（Cookie 写） | A,B + OWASP | 功能/安全 | `07-csrf-cors-security.md` | 条件必做（A/B/C） |
| 禁浏览器 localStorage JWT 主会话 | P0/OWASP 强化 | 工程/超越 | `06-tokens-and-api-clients.md` | 必做/超越 |
| JWT 仅 API/机器 | C 可映射 | 功能 | `06` | 必做（模式 D）/可选（Web） |
| Ory Kratos 作 IdP | B | 功能 | `INPUTS.md` §15 | 可选 |
| Keycloak 唯一默认 | — | — | — | **禁止** |
| 可观测/Sentry 类 | — | 参考 | — | 参考；**不进必勾** |

## 冲突记录

| 冲突 | 裁决 |
|------|------|
| Supabase Auth 常用 JWT vs Cookie 会话先进默认 | **Web 默认 Opaque Cookie session**；JWT 仅 API/机器（先进性 > 流行抄作业） |
| 流行「SPA + localStorage access_token」 | **禁止**作本指南浏览器主会话（见超越 a1） |
| Keycloak 生态常见 | **不**约定唯一默认；Kratos 等可选写入 INPUTS |
| Redis 会话流行 | 本册默认 **Postgres**；Redis 可选见 [docs/redis](../redis/README.md) |
| better-auth 目录习惯 vs 业务命名 | 库可参考；**词表/目录以本册 Pass1 为准** |
