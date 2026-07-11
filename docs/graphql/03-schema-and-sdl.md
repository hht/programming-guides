# 03 — Schema 与 SDL

## 不变量

- **SDL 文件 = 契约 SSOT**；CI 以仓库内 SDL 为门禁源，不以运行时 introspection 导出为唯一真相。 
- Schema 演进 = 契约变更：破坏性改名/删字段须版本策略或弃用期（INPUTS 写明）。 
- 禁止「ORM 实体自动暴露为 GraphQL」无显式 SDL 字段表。

## 步骤规格（实现自写）

1. 在 `schema/`（或 INPUTS §2 路径）编写 SDL：`Query` / `Mutation` 根；业务类型用 Pass1 词根。 
2. 对齐 [templates/schema.stub.graphql](./templates/schema.stub.graphql) 的根形状与错误扩展约定（码在执行层映射，不必把所有码写成 enum，除非产品需要）。 
3. Yoga（或写明例外的 Apollo）**从 SDL load** schema（`createSchema` / 等价）；禁默认 Pothos builder 当 SSOT。 
4. 自定义标量：INPUTS §14 列出；序列化/解析失败 → `VALIDATION_FAILED`。 
5. `graphql-eslint` 对 schema + operations 跑通；未知类型/字段 → CI 红。 
6. 文档注释（`"""`）写清业务含义；禁只写技术实现细节当唯一说明。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| SDL 与 resolver 字段不一致 | 启动失败或 CI 失败；禁止静默缺字段 |
| 破坏性删字段未弃用 | 禁止合并；须弃用期或 INPUTS 写明 breaking |
| code-first 漂移 | 禁止；若生成 SDL，diff 须零（生成物提交或 CI 生成比对） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 合法 stub schema load | Yoga/执行器成功构建 schema |
| operations 引用不存在字段 | eslint/codegen/校验失败 |
| 缺 Mutation 根但 INPUTS 声明有写 | INPUTS/CI 门闸失败 |
