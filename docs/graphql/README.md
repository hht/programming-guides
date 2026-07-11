# GraphQL — Schema-first API 指南

> **这是工程指南，不是半成品项目。** 
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **Schema-first GraphQL**：SDL 契约、类型安全读写、可分类错误、写路径鉴权+校验。 
> **默认栈**：**GraphQL SDL** 为契约 SSOT（禁 code-first 作默认）+ **GraphQL Yoga** + **graphql**（js）+ **graphql-eslint**（持久化操作可选）+ 客户端 **Typed document**（**graphql-codegen**）。**禁止** Pothos / code-first 作默认；**禁止** GraphQL 当无鉴权万能 CRUD；鉴权对接 [docs/auth](../auth/README.md) **Session Gate**。 
> **来源**：[sources.md](./sources.md)

## 品类一句话

客户端通过 **Schema-first GraphQL** 完成类型安全读写；错误可分类；写路径鉴权+校验。

## 核心正确性路径

**Operation Lifecycle**（[05](./05-operation-lifecycle.md)）：解析 → 校验 document → 鉴权 → resolve → 错误映射 → 响应。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停 
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`） 
3. [03](./03-schema-and-sdl.md) / [04](./04-operations-and-codegen.md) / [05](./05-operation-lifecycle.md) 
4. [06](./06-authz-and-mutations.md) / [07](./07-errors-and-security.md) / [08](./08-client-and-app-boundary.md) 
5. [commands.md](./commands.md) `check` 绿 
6. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者） 

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；SDL / 端点 / 鉴权对接 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-schema-and-sdl.md) | SDL 契约 SSOT |
| [04](./04-operations-and-codegen.md) | Operation + Typed document |
| [05](./05-operation-lifecycle.md) | **Operation Lifecycle** |
| [06](./06-authz-and-mutations.md) | 鉴权 + Mutation 校验 |
| [07](./07-errors-and-security.md) | 错误分类 / introspection |
| [08](./08-client-and-app-boundary.md) | 客户端与应用册边界 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | schema stub / env 例 |
