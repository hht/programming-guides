# SaaS — 多租户指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **多租户隔离、成员/RBAC、计费边界**。  
> **默认栈**：**共享 schema + `tenant_id` 行级** + **Postgres RLS**（对齐 [docs/postgres](../postgres/README.md) `06`）；**角色+权限表** RBAC（禁前端藏按钮当授权）；计费 = **计划/席位/状态机边界**（Stripe 等仅 INPUTS，不钉唯一支付商）；会话对齐 [docs/auth](../auth/README.md) Session Gate；**租户不得仅靠子域名猜测无校验**。  
> **来源**：[sources.md](./sources.md)  
> **支付细节**：本册只钉计费边界；卡支付/Webhook/Intent 见 [`docs/payments/`](../payments/README.md)（非某家 SDK 百科）。

## 品类一句话

用户在**租户（Tenant）**内协作：请求经租户解析与成员授权后读写租户作用域数据；计费以计划/席位/状态机为边界，失败 fail-closed。

## 核心正确性路径

**Tenant Gate Lifecycle**（[05](./05-tenant-gate-lifecycle.md)）：resolve tenant → authorize membership/role → scoped query → audit。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停  
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`）  
3. [03](./03-tenant-isolation.md) / [04](./04-membership-and-rbac.md) / [05](./05-tenant-gate-lifecycle.md)  
4. [06](./06-billing-boundary.md) / [07](./07-session-and-tenant-context.md) / [08](./08-audit-and-cross-boundary.md)  
5. [commands.md](./commands.md) `check` 绿  
6. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者）  

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；租户模型 / RBAC / 计费勾选 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-tenant-isolation.md) | 共享 schema + tenant_id + RLS |
| [04](./04-membership-and-rbac.md) | 成员 / 角色 / 权限 |
| [05](./05-tenant-gate-lifecycle.md) | **Tenant Gate Lifecycle** |
| [06](./06-billing-boundary.md) | 计划 / 席位 / 状态机边界 |
| [07](./07-session-and-tenant-context.md) | 与 auth 会话对齐；租户解析 |
| [08](./08-audit-and-cross-boundary.md) | 审计与跨册边界 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | schema / env / 状态矩阵例 |
