# 08 — 会话存储（Redis 可选路径）

> **鉴权 SSOT = [docs/auth](../auth/README.md)。** 
> auth **默认**会话存 **Postgres**；仅当 auth INPUTS「会话存储 = Redis」且本册 INPUTS 勾选会话时，按本章落地。 
> 未同时满足 → **禁止**在应用仓私自发明 Redis session 语义。

## 不变量

- Cookie / Gate / CSRF / 失败码：**全部 defer 到 auth**（03/05/07）；本章只定 **Redis 上的会话记录形状与键**。 
- **禁明文 token**：只存 `token_hash`（算法对齐 auth INPUTS，默认 SHA-256 + pepper）。 
- 键：`{prefix}session:{token_hash}`；或 HASH 字段对齐 [auth templates/session.schema.json](../auth/templates/session.schema.json) 子集。 
- 必有 TTL（idle/absolute 对齐 auth）；续期 = 滑动 TTL 或刷新 idle 字段 + `EXPIRE`。

## 步骤规格（实现自写）

1. **签发（Login 成功后 · auth 流程内）** 
 - 生成高熵 raw token → `token_hash`。 
 - `SET/HSET` 会话载荷 + `EXPIRE`（absolute 与 idle 策略按 auth）。 
 - `Set-Cookie` 属性**完全按 auth**，本册不另开 Cookie 规格。 
2. **Session Gate 读** 
 - Cookie → hash → `GET`；无键/过期 → 未认证（auth fail-closed）。 
3. **续期** 
 - 有效请求更新 idle 并 `EXPIRE`；超过 absolute → 拒绝并删键。 
4. **Logout** 
 - `DEL` 会话键（数据键，非锁键）+ 清 Cookie（auth）。 
5. **与 Cache-Aside** 
 - 会话键**不是**业务实体缓存；禁止用 `04` 的「源表」偷换会话撤销语义。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 无 Cookie / hash 无键 | 未认证（auth） |
| Redis 不可达 | fail-closed → 未认证（可 503 若 auth INPUTS 区分） |
| 明文 token 入库 | **验收失败** |
| 仅勾 Redis 会话未读 auth | INPUTS BLOCKED |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 登录后 | Redis 有 `session:{hash}`；无明文 token |
| 篡改 Cookie | Gate 未认证 |
| Logout | 键删除 |
| TTL | 会话键 TTL > 0 |
