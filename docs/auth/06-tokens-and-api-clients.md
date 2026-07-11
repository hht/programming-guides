# 06 — Tokens 与 API 客户端

## 不变量

- **浏览器 Web 默认**：主会话 = Cookie opaque session（`03`）；**禁止** JWT 存 **localStorage** 作主会话。  
- **JWT**：仅 **API / 机器客户端**（INPUTS 模式 D，或 B2B/M2M）可选。  
- Access token 短 TTL；刷新策略须书面（轮换 refresh 或客户端凭证重申）。  
- 校验 JWT：`iss`/`aud`/`exp`（及 alg 白名单）；失败 → 401。

## 步骤规格 — 机器 / API JWT

1. 客户端以 `Authorization: Bearer <jwt>` 调用。  
2. Gate 变体：验签（HMAC secret 或 JWKS）；检查 claims。  
3. `sub`（或钉死的 subject claim）→ 注入 Subject。  
4. 不设浏览器 Session Cookie（除非产品明确「JWT 兑换 Cookie」书面流程）。

## 步骤规格 — 浏览器（禁止项）

1. **不得**将 access_token 默认写入 `localStorage` / `sessionStorage` 当登录态 SSOT。  
2. SPA（react）对接同站 API：优先 **Cookie 会话** + CSRF（`07`）；跨域须 INPUTS CORS + 凭证策略。  
3. 若必须用短命内存持有 token（极少）：刷新后丢失须重新 Login；**仍不得**作为本指南默认。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 缺 Bearer | 401 |
| 过期 / 坏签 | 401 |
| aud/iss 不匹配 | 401 |
| 浏览器方案用 localStorage JWT 为主会话 | **验收 FAIL**（对照 `11` 超越 a1） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 有效 Bearer | 注入 subject |
| 过期 JWT | 401 |
| 无票 | 401 |
| Web 默认路径 | 使用 Cookie；测试断言不依赖 localStorage token |
