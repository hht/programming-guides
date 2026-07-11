# 09 — 测试与 CI

> 指南不附可运行测试源码；实现仓自写。

## 单测（case → 期望）

| case | 期望 |
|------|------|
| 无凭证访受保护 API | 401；无成功业务体 |
| 有效会话 Cookie | 注入 subject |
| 过期会话（absolute 或 idle） | 401/redirect；清 Cookie |
| **idle 内续期** | 活动请求后 `idle_expires_at` 延长；仍未超 absolute |
| 撤销后复用 Cookie | 401 |
| 库中无明文 token | 仅 `token_hash` |
| 凭证错误 Login | 无会话 Cookie |
| OAuth state 错误（B/C） | 无会话 |
| 写请求缺 CSRF（A/B/C） | 403；无副作用 |
| 已认证无权限 | 403 |
| Bearer 过期（D） | 401 |

## 发版矩阵

| # | 场景 | 断言 | 适用模式 |
|---|------|------|----------|
| 1 | Login | Set-Cookie `session`+HttpOnly（D：获有效 Bearer） | 全 |
| 2 | Logout / 撤销 | 再访受保护 → 401/redirect | 全 |
| 3 | 过期后访问 | 401/redirect；非假成功 | 全 |
| 4 | 未登录受保护 | 401 或 redirect | 全 |
| 5 | CSRF 写失败 | 403；资源未变 | A/B/C |
| 6 | OAuth 快乐路径 + PKCE | 建立本应用会话 | B/C |
| 7 | idle 续期 | 活动后未掉线；超 absolute 仍拒绝 | A/B/C |

## CI

| 门禁 | 何时 |
|------|------|
| 单测 | 每 PR `check` |
| 矩阵 1–4 | 发版必绿 |
| 5 / 6 / 7 | 按适用模式发版必绿；N/A 模式跳过并在报告写 `N/A — mode` |
| `check-inputs` | 每 PR |
| `check-acceptance` | 每 PR：核对 `11` **A+B+D** 可勾项（**不含** C 维护者节） |
