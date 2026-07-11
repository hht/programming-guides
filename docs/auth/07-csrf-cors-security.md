# 07 — CSRF、CORS 与安全

## 不变量

- Cookie 会话下，**状态改变**请求（POST/PUT/PATCH/DELETE）必须 CSRF 防护。  
- 默认：**双重提交** — 非 HttpOnly cookie `csrf_token` + 请求头 `X-CSRF-Token` 与会话行一致。  
- CORS：默认同站；跨域须 INPUTS 白名单 + `Allow-Credentials` 与具体 Origin（禁 `*`+凭证）。  
- 安全头（应用册可落）：至少不削弱 Cookie 标志；HTTPS 在 staging/prod。

## 步骤规格 — CSRF（默认双重提交）

1. Login 签发会话时生成 `csrf_token`（高熵）写入会话行。  
2. 同时 Set-Cookie：`csrf_token=<value>; Path=/; SameSite=Lax; Secure(prod)` — **非 HttpOnly**（供前端读取）。  
3. 前端写请求带头 `X-CSRF-Token: <value>`。  
4. Gate（或写中间件）：比较头与行内值；常量时间比较；失败 → **CSRF_FAILED**（403）。  
5. 可选替代（INPUTS 书面）：SameSite=Strict + 仅同源表单；仍须探针证明跨站写被拒。

## 步骤规格 — CORS

1. 同站：不配置放行任意 Origin。  
2. 跨域：INPUTS 列 staging/prod Origin；预检允许方法/头含 `X-CSRF-Token` 若用。  
3. `Access-Control-Allow-Credentials: true` 时 Origin **必须**精确枚举。

## 其它安全钉死

| 项 | 默认 |
|----|------|
| Cookie Secure | staging/prod true |
| 会话固定 | Login 成功后发新会话 id/token |
| 日志 | 禁记 raw session token / 密码 / 授权 code |
| 密码存贮 | 单向慢哈希（应用仓钉算法）；本指南不附实现 |

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 写请求缺 CSRF 头 | 403 |
| CSRF 不匹配 | 403 |
| CORS 未列 Origin | 浏览器拦截 / 服务端拒 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| POST 受保护缺 CSRF | 403；无副作用 |
| POST 正确 CSRF | 进入业务 |
| 跨站 Origin 不在白名单 | 无凭证响应或预检失败 |
