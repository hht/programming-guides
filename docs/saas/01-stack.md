# 01 — 默认栈（钉死）

> 选栈：**先进优先**（可运维的共享+RLS + 可测 RBAC）；流行度仅佐证。冲突见 [sources.md](./sources.md)。

## 一句话默认栈

**共享 schema + `tenant_id` + Postgres RLS**；**Membership + Role + Permission** 表；请求管道 = **Session Gate → Tenant Gate**；计费 = **Plan / Seat / BillingStatus 状态机**（支付商仅 INPUTS）；TS/Go/Python 应用侧按应用册接线，本册钉**能力边界**不钉某 ORM 唯一。

## 分层钉死

| 层 | 默认 | 禁止 / 备注 |
|----|------|-------------|
| 租户数据模型 | 共享 schema + `tenant_id` | schema-per 仅 INPUTS B |
| 行级隔离 | Postgres **RLS** `FORCE` + `app.tenant_id` | 仅靠应用 `WHERE` 而无 RLS（§1=A 时禁） |
| 身份 | [docs/auth](../auth/README.md) Opaque Cookie session（Web） | 本册不重钉会话 |
| 授权 | 角色+权限表（或 INPUTS 固定矩阵） | 前端藏按钮当授权 |
| 租户解析 | 头/路径/子域名 **候选** + Membership 校验 | 仅 DNS/Host 猜测 |
| 计费 | 计划码 + 席位 + 状态机 | 本册不钉 Stripe SDK 版本；Intent/Webhook → [payments](../payments/README.md) |
| 迁移 | 对齐 [docs/postgres](../postgres/README.md)（默认 Atlas+SQL） | 应用内手工改 prod schema |
| 审计 | 追加写 audit 事件（成员/权限/计费） | 无审计却声称合规默认 |

## 脚手架（按应用册）

| 目标 | 动作 |
|------|------|
| TS/Next/React | 应用册脚手架 + `features/tenant`（或等价词根）门闸；PG 迁移含 tenant/membership/role/permission |
| Go | `docs/go` + `internal/tenant` Gate 中间件；RLS session var 每请求 SET |
| Python | `docs/fastapi` + `tenant` 依赖注入 Gate |

锁版本：应用仓 lockfile；本指南钉能力边界，不钉 semver 数字。

## 环境

见 [templates/env.example](./templates/env.example)；staging/prod **成对**（INPUTS §11）。
