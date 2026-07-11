# 09 — 测试与 CI

> 指南不附可运行测试源码；实现仓自写。

## 单测（case → 期望）

| case | 期望 |
|------|------|
| 未登录访租户 API | 401 |
| 非成员 + 有效租户标识 | 403 `NOT_A_MEMBER`；无业务行 |
| 仅子域名无 Membership | 拒绝；不返回他租数据 |
| 成员缺 Permission | 403 `FORBIDDEN` |
| 成员有权读本租户 | 200；仅本 `tenant_id` 行 |
| 跨租户读（RLS） | 0 行 |
| 头/子域名冲突 | 403 `TENANT_MISMATCH` |
| 撤销成员后 | 403 |
| 邀请接受 → Membership `active` → Gate 放行 | 接受前 `invited` 拒绝；接受后同主体进租户成功 |
| 角色变更审计 | AuditEvent 存在 |
| `canceled` 写（计费启用） | `BILLING_INACTIVE` |
| 席位满 Invite（计费启用） | 拒绝 |
| 前端藏按钮但 API 裸调 | 仍 403 |

## 发版矩阵

| # | 场景 | 断言 | 适用 |
|---|------|------|------|
| 1 | 登录后进入租户 | Session + TenantContext；本租户数据 | 全 |
| 2 | 非成员拒绝 | 403；无泄漏 | 全 |
| 3 | 跨租户隔离 | A 不可见 B | 全 |
| 4 | RBAC 拒绝 | 缺权 403；有权成功 | 全 |
| 5 | 成员撤销即时生效 | 再访 403 + 审计 | 全 |
| 5a | 邀请接受 → Membership `active` → Gate 放行 | 接受后同主体可进租户；接受前 `invited` 仍 403 | 全（Invite 必做）；纯单人 N/A 时报告 `N/A — no invite` |
| 6 | 子域名/Host 无成员 | 403 非假成功 | 全（用子域名时） |
| 7 | 计费停用写 | `BILLING_INACTIVE` | §9 启用 |
| 8 | 席位门闸 | 超限不可加成员 | §9 启用 |

## CI

| 门禁 | 何时 |
|------|------|
| 单测 | 每 PR `check` |
| 矩阵 1–5 | 发版必绿 |
| 5a | Invite 默认必做时发版必绿；纯单人 N/A 时报告 `N/A — no invite` |
| 6 | 启用子域名解析时发版必绿；否则报告 `N/A` |
| 7–8 | 计费启用时发版必绿；否则 `N/A — no billing` |
| `check-inputs` | 每 PR |
| `check-acceptance` | 每 PR：核对 `11` **A+B+D**（**不含** C） |
