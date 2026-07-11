# 04 — 成员与 RBAC

## 不变量

- **Membership** 是「Subject 能否进入 Tenant」的唯一关系真相；无 active Membership → `NOT_A_MEMBER`。 
- **授权在服务端**：每次受保护动作检查 Permission（或角色矩阵）；UI 隐藏仅体验，**不是**授权。 
- 默认模型：**Role** + **Permission** + 关联表；角色挂在 Membership（或 Membership.role_id）。 
- 权限码稳定字符串（INPUTS §6）；改名 = 契约变更。 
- 邀请未接受 → 状态 `invited`，**不得**当 active 成员放行 Gate。 
- **Invite 默认必做**（共有能力）：创建 `invited` → 接受后 `active` → Gate 放行。仅极端「纯单人、无协作」可标明 N/A（见 INPUTS §4 / `11` §B）。

## 步骤规格（实现自写）

1. **表**：`memberships(subject, tenant_id, role_id|role, status, …)`；`roles`；`permissions`；`role_permissions`。 
2. **固定角色种子**（可 INPUTS 裁剪名）：至少 `owner` / `admin` / `member`（或词表等价）；`owner` 可转让须审计。 
3. **Invite**（默认必做）：创建 `invited` Membership 或独立 Invite 行 → 接受后 `active`；超额席位按 INPUTS §17。纯单人 N/A 时本步书面跳过。 
4. **Authorize**：给定 `(subject, tenant_id, permission)` → 查 Membership active → 角色 → 权限集 → 允许/拒绝。 
5. **变更**：改角色、撤销成员、删除权限绑定 → 写 Audit（`08`）；撤销后立即 Gate 失败。 
6. **平台超管**（INPUTS §14）：独立符号（如 `PlatformAdmin`）；**禁止**把超管塞进普通 Membership 静默提权；每次跨租户操作必审计。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 无 Membership | `NOT_A_MEMBER` → 403 |
| active 但缺 Permission | `FORBIDDEN` → 403 |
| `invited` / `revoked` | 同非成员；不得放行 |
| 仅前端隐藏按钮 | **不合格**；API 无检查则 FAIL |

## 权限矩阵例（实现须写明完整表）

| Permission | owner | admin | member |
|------------|-------|-------|--------|
| `tenant:read` | ✓ | ✓ | ✓ |
| `member:manage` | ✓ | ✓ | — |
| `billing:manage` | ✓ | —/✓（INPUTS） | — |
| 业务写（例 `resource:write`） | ✓ | ✓ | ✓/按产品 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 非成员访租户 API | 403 `NOT_A_MEMBER` |
| member 调 `member:manage` | 403 `FORBIDDEN` |
| admin 调 `member:manage` | 允许 |
| 撤销后复用旧上下文 | 拒绝 |
| 邀请接受 → `active` → Gate | 接受后放行；接受前 `invited` 拒绝 |
| 前端隐藏但 API 裸调 | 仍 403（证明服务端授权） |
