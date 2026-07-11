# 04 — Operations 与 Typed document

## 不变量

- 客户端主路径 = **Typed document**（graphql-codegen）；禁 `as any` / 无类型字符串当默认。  
- Operation 文档与 SDL 一同受 `graphql-eslint` 约束。  
- 持久化操作若启用（INPUTS §12）：未登记 document → 服务端拒绝。

## 步骤规格（实现自写）

1. 在 `graphql/operations/`（或应用册等价路径）为每个用户可感知读写写 `.graphql` / `.gql` 文档；**命名用业务词根**（Pass1）。  
2. 配置 **graphql-codegen**：schema 指向 SDL SSOT；生成 Typed document + 钩子/SDK（按应用册：React Apollo/urql/自己的 fetch 包装 — **类型来自 codegen**）。  
3. CI：`codegen` 后 **git diff 干净**（生成物入库）或「CI 生成并编译」二选一钉死；禁止生成物与 SDL 漂移。  
4. `graphql-eslint`：禁止匿名 operation（须具名）；unused variables → 红。  
5. 若启用持久化：构建时提取 hashes → allowlist；运行时只接受 allowlist（见 `05` 步骤 2 变体）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 手写无类型 query 进主路径 | 禁止合并；code review / lint 拒 |
| codegen 与 SDL 不一致 | CI 红 |
| 未登记 persisted operation | 拒绝执行（`VALIDATION_FAILED` 或专用码，INPUTS 钉） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 合法 Typed document 对 stub schema | codegen 成功；类型含业务字段 |
| 字段改名后未跑 codegen | `check` / tsc 红 |
| persisted 开启 + 任意匿名 query | 服务端拒绝 |
