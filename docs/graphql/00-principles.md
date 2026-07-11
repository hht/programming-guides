# 00 — 原则与不变量

## 品类

客户端通过 **Schema-first GraphQL** 完成类型安全读写；错误可分类；写路径鉴权+校验。

## 核心正确性路径（全文唯一）

**Operation Lifecycle**：解析 → 校验 document → 鉴权 → resolve → 错误映射 → 响应。规格见 [05](./05-operation-lifecycle.md)。

## 硬不变量

1. **SDL = 契约 SSOT**：类型、字段、枚举、指令以 `.graphql` SDL 为准；禁把 code-first schema 当唯一真相（若生成 SDL，CI 必须以检出的 SDL 为门禁源）。  
2. **运行时默认 GraphQL Yoga** + **graphql**（js）；**禁止 Pothos 作默认**（偏 code-first）。  
3. **客户端 Typed document**（graphql-codegen）；禁手写无类型 `any` 操作字符串当主路径。  
4. **写路径**：所有 Mutation **必须**经鉴权（对接 auth Session Gate 或 INPUTS 钉死的 Bearer）+ 输入校验；**禁止**公开 mutation 裸奔万能 CRUD。  
5. **Introspection**：staging/prod **默认关或受控**（INPUTS §8）。  
6. **错误可分类**：业务/鉴权/校验失败进 `errors[]` + `extensions.code`（词表）；禁止一律 `INTERNAL` 吞掉可预期失败。  
7. **本册 = GraphQL 契约与 Lifecycle SSOT**：应用册只接线；不平行发明第二套 schema/错误语义。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 端点 / introspection / 写路径策略 / 错误码 | `INPUTS.md` |
| SDL 形状 | 仓内 `schema/**/*.graphql` + `templates/schema.stub.graphql` |
| Operation Lifecycle 步骤与失败类 | `05-operation-lifecycle.md` |
| Mutation 鉴权与校验 | `06-authz-and-mutations.md` |
| 错误映射 / introspection / 深度限制 | `07-errors-and-security.md` |
| 与应用册 / codegen 边界 | `08-client-and-app-boundary.md` |
| 会话语义 | [docs/auth](../auth/README.md)（本册不重定义 Cookie/Gate） |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止

- 指南仓堆可运行业务 resolver / 完整 Yoga 应用  
- 默认 code-first（Pothos 等）或「GraphQL = 自动暴露全部 SQL/ORM」  
- 未鉴权公开 Mutation CRUD  
- staging/prod 对匿名公网开 introspection（除非 INPUTS 书面受控方案）  
- 用 GraphQL 绕过 auth Session Gate 另搞一套「宽松登录」  
