# 03 — 会话与 Cookie

## 不变量

- Web 默认：**Opaque** 会话 token + Cookie 传递；服务端查表校验。  
- Cookie：`HttpOnly` + `Secure`（staging/prod）+ `SameSite`（默认 Lax）+ `Path=/`；名默认 **`session`**。  
- 存库：**仅 `token_hash`**（例 SHA-256(token + pepper) 或 argon2id(token)；算法钉在实现仓）；**禁止明文 token 列**。  
- 存储默认 **Postgres**；Redis 可选路径见 [docs/redis](../redis/README.md) `08`。

## 步骤规格（实现自写）

1. **签发（Login 成功后）**  
   - 生成高熵 token（≥128 bit 随机）。  
   - 计算 `token_hash`；插入会话行：`id`、`subject`、`token_hash`、`expires_at`、`idle_expires_at`（若用）、`csrf_token`（若双重提交）、`created_at`。  
   - `Set-Cookie: session=<token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=…`（属性以 INPUTS 为准）。  

2. **读取**  
   - 从 Cookie 取 raw token；缺 → 未认证。  
   - 算 hash → 查表；无行 / 过期 → 未认证并宜清 Cookie。  

3. **续期**  
   - 有效请求可滑动 `idle_expires_at`（INPUTS TTL）；超过 absolute → 必须重新 Login。  

4. **撤销（Logout）**  
   - 删会话行（或标 `revoked_at`）；`Set-Cookie` 空 + `Max-Age=0`。  
   - 多设备：按 INPUTS「仅本机 / 全部」。  

5. **字段形状**  
   - 对齐 [templates/session.schema.json](./templates/session.schema.json)。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 无 Cookie | 未认证 |
| hash 无匹配 | 未认证；清 Cookie |
| 过期 / 已撤销 | 未认证；清 Cookie |
| 存储错误 | fail-closed → 未认证（可 503 若 INPUTS 区分运维；默认不当作已登录） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 登录后 Cookie 含 HttpOnly session | 响应 Set-Cookie 含 HttpOnly；库中无明文 token |
| 篡改 Cookie 值 | Gate 未认证 |
| 过期会话访受保护 | 401 或 redirect；非 200 业务成功 |
| Logout | 行删除/撤销 + Cookie 清除 |
