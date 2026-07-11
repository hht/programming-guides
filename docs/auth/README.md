# Auth — 会话与身份指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **会话 Cookie 和/或 OAuth/OIDC** 登录、Session Gate、受保护资源 fail-closed。  
> **默认栈**：Web 第一方 = **Opaque server-side session** + `HttpOnly`+`Secure`+`SameSite` Cookie（名默认 `session`）；会话存 **Postgres**（`hash(token)`，禁明文）；Redis 可选路径见 [docs/redis](../redis/README.md)（默认仍 PG）；OAuth/OIDC = Authorization Code + **PKCE**（禁 Implicit）；TS 参考库 **better-auth**；Go = 自研薄 session+OIDC 客户端或对接 IdP；Python = **Authlib** + 自管 session。  
> **来源**：[sources.md](./sources.md)

## 品类一句话

用户通过**会话 Cookie 和/或 OAuth/OIDC**完成登录；受保护请求在验会话后注入身份，失败 fail-closed。

## 核心正确性路径

**Session Gate Lifecycle**（[05](./05-session-gate-lifecycle.md)）：请求 → 读会话凭证 → 校验有效性 → 注入 subject → 授权 → 放行/拒绝。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；按「模式裁剪」只读必读章  
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`）  
3. 按模式落地 [03](./03-sessions-and-cookies.md) / [04](./04-credentials-and-oauth.md) / [05](./05-session-gate-lifecycle.md)（D 用 Bearer Gate 变体）  
4. 按 INPUTS「模式裁剪」落地 [06](./06-tokens-and-api-clients.md) / [07](./07-csrf-cors-security.md) / [08](./08-cross-app-boundary.md)（裁剪表标 N/A 的章跳过）  
5. [commands.md](./commands.md) `check` 绿  
6. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者）  

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；鉴权模式互斥勾选 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-sessions-and-cookies.md) | 会话与 Cookie |
| [04](./04-credentials-and-oauth.md) | 凭证登录与 OAuth/OIDC |
| [05](./05-session-gate-lifecycle.md) | **Session Gate Lifecycle** |
| [06](./06-tokens-and-api-clients.md) | JWT / API 客户端 |
| [07](./07-csrf-cors-security.md) | CSRF / CORS / 安全 |
| [08](./08-cross-app-boundary.md) | 与应用册边界 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | schema / env 例 |
