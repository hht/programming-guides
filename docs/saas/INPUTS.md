# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写多租户实现**。  
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL/字段表/P0）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **租户模型（互斥勾选一）** | □ **A. 共享 schema + `tenant_id` + RLS**（**默认；先进/可运维**） □ **B. schema-per-tenant**（仅当有书面运维/合规理由；须钉迁移/连接策略） |
| 2 | **Tenant 标识** | 主键类型（默认 UUID）+ 对外 slug（可选）+ 展示名字段；列名钉死 |
| 3 | **租户解析策略** | 至少一种且可组合：□ 路径/头 `X-Tenant-Id`（或 slug）□ 子域名 □ Cookie/会话绑定当前租户。**硬约束**：解析结果必须经 **Membership 校验**；禁止「仅子域名猜测即 scoped query」 |
| 4 | **Membership** | 表/实体：`subject` ↔ `tenant_id` + `role`（或 `role_id`）+ 状态（`active`/`invited`/`revoked`）。**Invite 默认必做**（邀请 → 接受 → `active`）；仅极端「纯单人、无协作」可书面 **N/A**（acceptance 须一行理由） |
| 5 | **RBAC** | □ 角色表 + 权限表 + 角色-权限关联（默认）□ 固定枚举角色（须列权限矩阵）。**禁**仅前端藏按钮当授权 |
| 6 | **权限码表** | 至少列：资源读/写、成员管理、计费管理（可 `tenant:read` / `member:manage` / `billing:manage`）；与 `04` 词根一致 |
| 7 | **会话对齐** | 须勾选并遵守 [docs/auth](../auth/README.md)：Subject 来自 Session Gate；Tenant Gate **在** Session Gate 之后（或同请求管道明确顺序） |
| 8 | **Postgres / RLS** | §1=A：对齐 [docs/postgres](../postgres/README.md) `06` — `ENABLE`+`FORCE` RLS；`set_config('app.tenant_id', …, true)`。§1=B：书面 N/A RLS + schema 切换策略 |
| 9 | **计费边界** | □ 启用计划/席位/状态机（见 `06`）□ **N/A — 无计费**（acceptance 写裁剪理由）。启用时：计划码、席位上限字段、状态枚举（至少 `trialing`/`active`/`past_due`/`canceled`） |
| 10 | **支付商** | 计费启用时：□ Stripe □ 其它（须钉 webhook 签名校验 URL/密钥名）。**不**把某家钉为指南唯一默认；细节可 defer 未来 payments 册，但本仓须有「状态机谁写、谁读」 |
| 11 | **环境成对** | staging/prod：`APP_ENV`、`DATABASE_URL`、租户解析密钥/域名表（若子域名）、计费 webhook secret（若启用）；**值不入库** |
| 12 | **错误码表** | 至少：`UNAUTHENTICATED` / `TENANT_NOT_FOUND` / `TENANT_MISMATCH` / `NOT_A_MEMBER` / `FORBIDDEN` / `BILLING_INACTIVE`（无计费则后一项 N/A）→ HTTP status |
| 13 | **审计** | □ 写路径记 audit（谁/哪租户/何动作/何时）□ 裁剪书面理由。默认：**必做**成员变更 + 权限变更 + 计费状态变更 |
| 14 | **跨租户运维** | □ 禁止应用角色跨租户 □ 允许平台超级管理员（须独立角色名 + 审计 + 禁走普通 Tenant Gate 静默提权） |
| 15 | **应用册对接** | □ nextjs □ react □ go □ fastapi □ 多册（列清单）— 租户语义以本册为 SSOT（`08`） |

## 若适用

| # | 项 |
|---|-----|
| 16 | 子域名根域（staging/prod）与 TLS 通配 |
| 17 | 席位超额策略：拒绝邀请 / 只读降级（钉死一） |
| 18 | 自定义角色（PBAC）开关 |
| 19 | 租户删除/停用软删与宽限期 |

## 模式裁剪（钉死）

| 勾选 | 必读章 | 可 N/A |
|------|--------|--------|
| §1=A 共享+RLS | 03、04、05、07、08；postgres `06` | 03 中 schema-per 节 |
| §1=B schema-per | 03（schema-per 节）、04、05、07、08 | RLS 强制行（书面） |
| §9=无计费 | — | 06 计费状态机；错误码 `BILLING_INACTIVE` |
| §9=启用计费 | 06 | — |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
