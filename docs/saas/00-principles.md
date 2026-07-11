# 00 — 原则与不变量

## 品类

用户在**租户（Tenant）**内协作：请求经租户解析与成员授权后读写租户作用域数据；计费以计划/席位/状态机为边界，失败 fail-closed。

## 核心正确性路径（全文唯一）

**Tenant Gate Lifecycle**：resolve tenant → authorize membership/role → scoped query → audit。规格见 [05](./05-tenant-gate-lifecycle.md)。

## 硬不变量

1. **默认租户模型**：共享 schema + 每行 `tenant_id` + **Postgres RLS**（`FORCE`）；schema-per-tenant 仅 INPUTS 显式勾选。 
2. **Tenant Gate 在 Session Gate 之后**：无 Subject → 不得进入租户解析成功路径（对齐 [docs/auth](../auth/README.md)）。 
3. **租户解析必须校验 Membership**：子域名/头/路径仅为候选；校验失败 → `NOT_A_MEMBER` / `TENANT_MISMATCH`，禁 scoped query。 
4. **授权在服务端**：角色+权限（或固定角色矩阵）为 SSOT；**禁止**仅靠前端藏按钮。 
5. **查询作用域**：业务读/写必须带租户上下文（RLS `app.tenant_id` 和/或显式 `WHERE tenant_id =`）；禁止无作用域全表扫业务数据。 
6. **计费边界**：计划/席位/状态机与「能否写业务」门闸可测；支付商细节不进本册百科；无计费须 INPUTS 裁剪。 
7. **fail-closed**：缺租户、非成员、权限不足、计费停用（若启用）→ 拒绝；禁止假成功业务体。 
8. **本册 = 多租户 SSOT**：应用册引用本册；不平行发明第二套租户/RBAC 语义。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 租户模型 / 解析策略 / 权限码 / 计费开关 | `INPUTS.md` |
| Tenant / Membership 字段形状 | `templates/*.schema.json` + 迁移 |
| Tenant Gate 步骤与失败码 | `05-tenant-gate-lifecycle.md` |
| RLS / `app.tenant_id` | [docs/postgres](../postgres/README.md) `06` + 本册 `03` |
| Session / Subject | [docs/auth](../auth/README.md) |
| 计费状态机 | `06` + `templates/billing-state-matrix.md` |
| 审计事件最小集 | `08` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止

- 指南仓堆可运行 SaaS 业务模块 / 完整 Stripe 集成代码 
- 将 Stripe（或任一家）规定为唯一支付默认（仅 INPUTS 条件） 
- 仅子域名猜测即信任租户 
- 前端 RBAC 当唯一授权 
- 未授权却返回跨租户或本租户成功写结果 
