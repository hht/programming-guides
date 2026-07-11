# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| PostgreSQL RLS | https://www.postgresql.org/docs/current/ddl-rowsecurity.html |
| OWASP Access Control Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html |
| OWASP Session Management（与 auth 对齐） | https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html |
| NIST SP 800-63B（Digital Identity；授权边界参考） | https://pages.nist.gov/800-63-3/sp800-63b.html |

## 标杆 B（开源 P1）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [calcom/cal.com](https://github.com/calcom/cal.com) | P1 | Organization/Team 成员与角色、席位计费边界、子域/org slug | 整站复制业务与 Stripe 细节当唯一支付百科 | 多租户调度 SaaS：组织、成员、RBAC、席位 |
| B | [makeplane/plane](https://github.com/makeplane/plane) | P1 | Workspace 隔离、成员角色、项目作用域 | 照搬前端目录 | 多租户项目管理：工作区与成员 |
| C | [twentyhq/twenty](https://github.com/twentyhq/twenty) | P1 | Workspace 多租户、成员邀请、权限 | 抄 CRM 领域模型当 SaaS 唯一 | 多租户 CRM：工作区与访问控制 |

候选未入选（可作扩展阅读）：[chatwoot/chatwoot](https://github.com/chatwoot/chatwoot)（Account 多租户客服）、[TryGhost/Ghost](https://github.com/TryGhost/Ghost)（多站/发布，租户形态较弱）。

## 共有能力切条

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 租户/组织/工作区隔离 | ✓ | ✓ | ✓ | 必做 |
| 成员邀请/加入 | ✓ | ✓ | ✓ | **必做**（默认；纯单人无协作仅标明 N/A） |
| 角色 / 权限 | ✓ | ✓ | ✓ | 必做 |
| 非成员/缺权拒绝 | ✓ | ✓ | ✓ | 必做 |
| 计费计划/席位 | ✓ | 云-only（非开源 P1 可检） | 云-only（非开源 P1 可检） | **非共有** → **条件/可选**（与 `11` §B 一致）：仅 INPUTS §9 启用时必做；否则 N/A。开源可检强证据仅 A=1 源，不升格共有必做 |
| 登录后进入租户上下文 | ✓ | ✓ | ✓ | 必做 |

## 差距表

| 缺口 | 来自标杆 | 类型 | 落入文件 | 必做/可选/参考 |
|------|----------|------|----------|----------------|
| 共享 schema + tenant_id + FORCE RLS 默认 | A/B/C 可映射 + P0 RLS | 工程 | `03` | 必做（§1=A）/超越 |
| Membership + Role + Permission | A,B,C | 功能 | `04` | 必做 |
| Tenant Gate 编号步骤 + 失败分类 | A,B,C | 工程 | `05` | 必做 |
| 解析候选必须 Membership 校验（禁仅子域名） | A 有子域 + OWASP | 安全/超越 | `05`/`07` | 必做/超越 |
| 服务端 RBAC；禁前端唯一授权 | A,B,C + OWASP | 安全 | `04`/`09` | 必做 |
| 计划/席位/状态机边界 | A 开源可检；B/C 仅云 | 功能 | `06` | **条件/可选**（非共有必做；同 `11` §B） |
| 支付商百科 / Stripe 唯一默认 | — | — | — | **禁止**写明；INPUTS 条件；细节 → [payments](../payments/README.md) |
| Session Gate 对齐 | auth 册 + 标杆登录流 | 工程 | `07` | 必做 |
| 审计成员/权限/计费变更 | A 等有审计痕迹 | 功能/工程 | `08` | 必做 |
| schema-per-tenant | 少数合规场景 | 功能 | `03` / INPUTS | 可选 |
| 可观测/Sentry 类 | — | 参考 | — | 参考；**不进必勾** |

## 冲突记录

| 冲突 | 裁决 |
|------|------|
| schema-per-tenant vs 共享+RLS | **默认共享+tenant_id+FORCE RLS**（先进/可运维）；schema-per 仅 INPUTS B |
| 标杆多用 Prisma/应用层过滤 | 本指南 **RLS 强制**（P0 + 可验证隔离）优于「仅应用 WHERE」 |
| Stripe 在 cal.com 很重 | **不**约定唯一支付商；本册只约定计费状态机与席位门闸 |
| Org / Workspace / Team 命名分叉 | Pass1 **Tenant** 为词根；别名须在词表唯一映射 |
| 前端藏菜单当权限 | **禁止**；服务端 Authorize 为 SSOT |
