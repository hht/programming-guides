# 05 — Session Gate Lifecycle（核心）

> **全文唯一核心正确性路径。** 
> 请求 → 读会话凭证 → 校验有效性 → 注入 subject → 授权 → 放行/拒绝。

## 不变量

- 每个受保护入口 **只** 经本生命周期；禁止业务层「假设已登录」。 
- 失败 **fail-closed**：API **401**；浏览器导航 **redirect** 登录（INPUTS §12）；**禁止假成功**。 
- 校验通过后注入 **Subject**（词表符号）；下游只读注入结果，不重解析 Cookie。 
- 超越：① 浏览器禁 localStorage JWT 主会话；② Gate 失败禁止 200 假成功（见 `11`）。

## 步骤规格（编号固定）

| # | 步骤 | 规格 |
|---|------|------|
| 1 | **请求进入** | 匹配受保护路由/中间件/依赖（公开路由跳过 Gate，须显式 allowlist）。 |
| 2 | **读会话凭证** | **模式 A/B/C**：Cookie（名=INPUTS，默认 `session`）opaque token。**模式 D**：`Authorization: Bearer`（校验规则见 `06`，失败类仍用本表）。缺凭证 → **UNAUTHENTICATED**。 |
| 3 | **校验有效性** | **A/B/C**：`hash(token)` 查库；未撤销；`expires_at`/`idle_expires_at`。**D**：验 JWT 签名/iss/aud/exp（`06`）；revocation 若启用则查黑名单。存储/JWKS 错误 → **STORE_UNAVAILABLE** 或按未认证（INPUTS 约定）。无效 → **SESSION_INVALID** / **SESSION_EXPIRED**（JWT 过期映射为 SESSION_EXPIRED）。 |
| 4 | **注入 subject** | **A/B/C**：行内 `subject`（及会话 id）写入请求上下文。**D**：由 JWT claims 映射 Subject（字段映射见 `06` + INPUTS）。**禁止**把 raw token/JWT 传入业务。 |
| 5 | **授权** | 若资源需角色/权限：在已认证前提下检查；失败 → **FORBIDDEN**（403），不是假装未登录。无细粒度权限则本步空操作并放行。 |
| 6 | **放行 / 拒绝** | 放行 → 进入业务；拒绝 → 按失败分类表响应；**不得**返回成功业务 payload。 |

可选：**续期** — 步骤 3 成功后滑动 idle（`03`）；续期失败不得阻断已通过校验的本请求，除非 absolute 已过。

## 失败分类表

| 类 | 条件 | HTTP / 浏览器 | 备注 |
|----|------|---------------|------|
| `UNAUTHENTICATED` | 无凭证 | 401 / redirect `/login` | 禁 200 |
| `SESSION_EXPIRED` | 过期 | 401 / redirect + 可进 `session-expired` UI | 清 Cookie |
| `SESSION_INVALID` | hash 不匹配、已撤销、格式损坏 | 401 / redirect | 清 Cookie |
| `FORBIDDEN` | 已认证但授权失败 | 403 | 有 Subject |
| `CSRF_FAILED` | 写操作 CSRF 失败（见 `07`） | 403 | 有会话仍拒绝写 |
| `STORE_UNAVAILABLE` | 存储错误且 INPUTS 区分 | 503 或按未认证 | 默认勿当已登录 |

## 伪代码（非实现）

```text
gate(req):
 token = readCookie(req, COOKIE_NAME) // or Bearer if mode D
 if !token → reject UNAUTHENTICATED
 row = store.findByHash(hash(token))
 if !row || revoked(row) → reject SESSION_INVALID
 if now > row.expires_at → reject SESSION_EXPIRED
 if row.idle_expires_at && now > row.idle_expires_at → reject SESSION_EXPIRED
 // 可选：touch idle_expires_at（不超过 absolute expires_at）
 inject(req, subject=row.subject, sessionId=row.id)
 if !authorize(req, subject) → reject FORBIDDEN
 if isWrite(req) && !csrfOk(req, row) → reject CSRF_FAILED
 return allow
```

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 无 Cookie 访受保护 API | 401；无业务体成功字段 |
| 无 Cookie 访受保护页 | redirect 登录；非 200 主内容冒充已登录 |
| 有效会话 | 注入 subject；进入业务 |
| 过期会话 | 401/redirect；类 SESSION_EXPIRED |
| 已认证无权限 | 403 FORBIDDEN |
| 有效会话但 CSRF 失败（写） | 403；不执行写 |
| 篡改 token | 401 SESSION_INVALID |
