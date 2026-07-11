# 01 — 默认栈

> 选栈：**先进优先**；流行度仅佐证。冲突见 [sources.md](./sources.md)。
>
> 框架 MUST 见 [`00`](./00-principles.md)。本册无独立 Language Gate；实现语言的 fmt/lint 跟宿主应用册。

## 一句话默认栈

**Opaque server-side session** + Cookie（`HttpOnly`/`Secure`/`SameSite`，名 `session`）存 **Postgres**（`hash(token)`）；OAuth/OIDC = **Authorization Code + PKCE**；TS → **better-auth**；Go → 自研薄 session + OIDC 客户端或对接 IdP；Python → **Authlib** + 自管 session。

## 分层写明

| 层 | 默认 | 禁止 / 备注 |
|----|------|-------------|
| Web 浏览器会话 | Opaque session + Cookie | 禁 localStorage JWT 作主会话 |
| Cookie | 名 `session`；HttpOnly; Secure(staging/prod); SameSite=Lax; Path=/ | 改名须 INPUTS |
| 会话存储 | **Postgres** 表 | Redis 可选：见 [docs/redis](../redis/README.md) `08` |
| OAuth/OIDC | Auth Code + PKCE | 禁 Implicit |
| JWT | **仅 API/机器客户端**可选 | 非浏览器默认主会话 |
| TS 库 | **better-auth**（先进） | 不强制抄其目录；契约以本册为准 |
| Go | 自研薄 session + OIDC 客户端，或对接 IdP | 禁半吊子自写加密协议替代 HTTPS |
| Python | **Authlib**（OAuth）+ 自管 session | — |
| IdP（可选） | INPUTS 可勾 **Ory Kratos** | **禁止**将 Keycloak 规定为唯一默认 |

## 脚手架（按应用册）

| 目标 | 动作 |
|------|------|
| TS/Next | 应用册脚手架后接入 better-auth **或** 等价自管 session（须满足本册不变量） |
| Go | `docs/go` 脚手架 + `internal/session`（业务名）门闸中间件 |
| Python | `docs/fastapi` 脚手架 + Authlib OAuth 客户端 + session 表 |

锁版本：应用仓 lockfile 锁定；本指南不指定具体 semver 数字，约定**能力边界**。

## 环境

见 [templates/env.example](./templates/env.example)；staging/prod **成对**（INPUTS §10）。
