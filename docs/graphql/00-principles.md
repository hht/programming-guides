# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层 → [typescript Language Gate](../meta/language-gates/typescript.md)（默认 JS/TS Yoga 栈）。本文件只含 **GraphQL 框架 MUST**。

## 品类

客户端通过 **Schema-first GraphQL** 完成类型安全读写；错误可分类；写路径鉴权+校验。

## 核心正确性路径（全文唯一）

**Operation Lifecycle**：解析 → 校验 document → 鉴权 → resolve → 错误映射 → 响应。规格见 [05](./05-operation-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | SDL 为契约 SSOT（`.graphql`）；CI 以检出 SDL 为门禁源 | `codegen` / lint:graphql |
| F02 | MUST NOT | 以 code-first schema 为唯一真相（若生成 SDL，仍以检出 SDL 为准） | 同上 |
| F03 | MUST | 运行时默认 GraphQL Yoga + graphql（js） | `01` |
| F04 | MUST NOT | 以 Pothos 等作默认（偏 code-first） | `01` |
| F05 | MUST | 客户端 Typed document（graphql-codegen） | codegen 产物 |
| F06 | MUST NOT | 手写无类型 `any` 操作字符串当主路径 | lint / 抽检 |
| F07 | MUST | Mutation 经鉴权 + 输入校验 | `06` / e2e |
| F08 | MUST NOT | 公开 mutation 裸奔万能 CRUD | 同上 |
| F09 | MUST | staging/prod introspection 默认关或受控（INPUTS §8） | 配置抽检 |
| F10 | MUST | 可预期失败进 `errors[]` + `extensions.code` | `07` / 单测 |
| F11 | MUST NOT | 一律 `INTERNAL` 吞掉可预期失败 | 同上 |
| F12 | MUST | 本册为 GraphQL 契约与 Lifecycle SSOT | 边界 |

## SSOT 表

| 真相 | Owner |
|------|--------|
| 端点 / introspection / 写路径策略 / 错误码 | `INPUTS.md` |
| SDL 形状 | 仓内 `schema/**/*.graphql` + `templates/schema.stub.graphql` |
| Operation Lifecycle 步骤与失败类 | `05-operation-lifecycle.md` |
| Mutation 鉴权与校验 | `06-authz-and-mutations.md` |
| 错误映射 / introspection / 深度限制 | `07-errors-and-security.md` |
| 与应用册 / codegen 边界 | `08-client-and-app-boundary.md` |
| 会话语义 | [docs/auth](../auth/README.md) |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止（摘要）

- 「GraphQL = 自动暴露全部 SQL/ORM」  
- 用 GraphQL 绕过 auth Session Gate  
