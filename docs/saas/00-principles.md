# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：随宿主应用册 Language Gate（本册不另开语言百科；实现语言的 fmt/lint 跟宿主 `commands`）。

## 品类

用户在**租户**内协作：租户解析与成员授权后读写租户作用域数据；计费以计划/席位/状态机为边界。

## 核心正确性路径（全文唯一）

**Tenant Gate Lifecycle**：resolve tenant → authorize → scoped query → audit。规格见 [05](./05-tenant-gate-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 默认 shared schema + tenant_id + PG RLS FORCE | `03`+postgres |
| F02 | MUST | Tenant Gate 在 Session Gate 之后 | `05`+auth |
| F03 | MUST | 租户解析必须校验 Membership | `05` |
| F04 | MUST | 授权在服务端 | `05`/`07` |
| F05 | MUST NOT | 仅靠前端藏按钮当授权 | 同上 |
| F06 | MUST | 读写带租户上下文 | 泄漏探针 |
| F07 | MUST | 计费门闸可测 | `06` |
| F08 | MUST | fail-closed | `05` |
| F09 | MUST | 本册为多租户 SSOT | 边界 |

## SSOT

| 真相 | Owner |
|------|--------|
| 租户模型 / 解析 / 权限码 / 计费开关 | `INPUTS.md` |
| Tenant / Membership 形状 | templates + 迁移 |
| Tenant Gate | `05` |
| RLS | postgres `06` + 本册 `03` |
| Session | [auth](../auth/README.md) |
| 计费状态机 | `06` + billing-state-matrix |
| 审计 | `08` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md` |
