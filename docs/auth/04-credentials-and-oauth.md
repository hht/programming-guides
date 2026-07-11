# 04 — 凭证登录与 OAuth/OIDC

## 不变量

- 凭证 Login 成功 **只** 走本应用 Session 签发（见 `03`）；不把密码哈希返回客户端。 
- OAuth/OIDC：**Authorization Code + PKCE**；**禁 Implicit**；禁把 IdP access_token 默认塞进 localStorage 当本应用主会话。 
- 回调校验：`state`、`code_verifier`、issuer、client_id；失败 fail-closed。 
- Keycloak **不是**唯一默认；Ory Kratos 等为 INPUTS **可选** IdP。

## 步骤规格 — 凭证 Login

1. 收 identifier + secret（或魔法链接 token）。 
2. 恒定时间比较密码哈希（或验证一次性 token）。 
3. 失败 → 统一错误（防枚举：可固定文案「凭证无效」）；成功 → `03` 签发。 
4. 可选：登录成功旋转会话（删旧发新）。

## 步骤规格 — OAuth/OIDC Login

1. **开始**：生成 `state` + PKCE `code_verifier`/`code_challenge`；存服务端（或加密 Cookie）短 TTL；302 到授权端点。 
2. **回调**：校验 `state`；用 `code` + `code_verifier` 换 token（token endpoint）；校验 ID Token（OIDC：`iss`/`aud`/`exp`/`nonce` 若用）。 
3. **关联 Subject**：按 `sub`（+ issuer）查找或创建本地 Subject。 
4. **签发本应用 Session**（`03`）；**不要**默认把 IdP refresh_token 暴露给浏览器 JS。 
5. 错误：任意校验失败 → 不签发会话；redirect 错误页或 401。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 密码错误 | 401/redirect；无会话 |
| OAuth state 不匹配 | 拒绝；无会话 |
| PKCE 失败 | 拒绝；无会话 |
| IdP 不可达 | 502/503 或错误页；无会话 |
| Implicit 被配置 | **禁止合并**；INPUTS/实现检查失败 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 正确凭证 | Set-Cookie session + 库有 hash 行 |
| 错误凭证 | 无 Set-Cookie 会话；无新会话行 |
| OAuth 缺 PKCE verifier | 无会话 |
| OAuth state 篡改 | 无会话 |
