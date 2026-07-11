# 05 — Operation Lifecycle（核心）

> **全文唯一核心正确性路径。**  
> 解析 → 校验 document → 鉴权 → resolve → 错误映射 → 响应。

## 不变量

- 每个 GraphQL HTTP 请求 **只** 经本生命周期；禁止 resolver「假设已鉴权」。  
- 鉴权对接 **docs/auth Session Gate**（或 INPUTS Bearer）；失败 **fail-closed**。  
- 超越：① staging/prod introspection 关或受控；② Mutation 必须鉴权+输入校验（见 `06`、`07`、`11`）。

## 步骤规格（编号钉死）

| # | 步骤 | 规格 |
|---|------|------|
| 1 | **解析** | 读 HTTP body。**缺 `query` 字段或 body 非 JSON → HTTP 400**，不进入本表后续步骤。有 `query`：解析 AST；语法错误 → `VALIDATION_FAILED`（HTTP 按 INPUTS §7：默认 200+errors），不进入 resolve。 |
| 2 | **校验 document** | 对照 SDL：已知类型/字段/参数；变量类型匹配。失败 → `VALIDATION_FAILED`，**不**执行 resolver。若启用持久化操作：hash/id 不在 allowlist → 拒绝。可选：深度/复杂度超限 → `VALIDATION_FAILED` 或 `RATE_LIMITED`（INPUTS §17）。 |
| 3 | **鉴权** | 构建 Context：调用 **Session Gate**（Cookie）或 Bearer 校验（auth 模式 D）。公开 Query：仅当 INPUTS §6 allowlist **显式包含**该 operation/字段。任一 **Mutation** 无有效 Subject → `UNAUTHENTICATED`（或 `FORBIDDEN` 若已认证无写权限，见 `06`）。 |
| 4 | **resolve** | 按字段树执行 resolver；业务规则失败抛/返回可映射错误（`NOT_FOUND` / `VALIDATION_FAILED` / `FORBIDDEN`）。禁止吞掉后返回假成功 payload。 |
| 5 | **错误映射** | 将异常/业务失败映射为 GraphQL `errors[]` + `extensions.code`（词表）；剥离内部堆栈对外（staging/prod）。部分成功：仅当产品明确允许；默认 Mutation **一错则该操作无业务副作用**（与事务边界对齐应用册/postgres）。 |
| 6 | **响应** | 返回 `{ data, errors? }`。HTTP：**严格按 INPUTS §7**（默认 A=200+errors；B=未认证 401）。全仓不得混用。 |

## 失败分类表

| 类 | 条件 | 响应要点 |
|----|------|----------|
| `UNAUTHENTICATED` | 无/坏会话且非公开 allowlist | errors + code；禁假成功 data |
| `FORBIDDEN` | 已认证无权限 | 403 语义；有 Subject |
| `VALIDATION_FAILED` | 文档/变量/输入校验失败 | 不执行写 |
| `NOT_FOUND` | 业务实体不存在 | — |
| `INTERNAL` | 非预期 | 不泄露内部细节 |
| `RATE_LIMITED` | 复杂度/限流（若启用） | — |

## 伪代码（非实现）

```text
lifecycle(req):
  doc = parse(req.body.query)            // fail → VALIDATION_FAILED
  validate(doc, schema)                  // fail → VALIDATION_FAILED
  if persisted && !allowlisted(doc) → reject VALIDATION_FAILED
  subject = sessionGate(req)             // or bearer
  if isMutation(doc) && !subject → reject UNAUTHENTICATED
  if isQuery(doc) && !subject && !inPublicAllowlist(doc) → reject UNAUTHENTICATED
  result = execute(schema, doc, context={subject}, variables)
  return mapErrors(result)               // extensions.code
```

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 语法错误 query | HTTP 按 §7 默认 **200** + `VALIDATION_FAILED`；无 resolver 副作用（**不是**运输层 400；400 仅缺 query/非 JSON） |
| 未知字段 | 校验失败；不 resolve |
| 无会话 Mutation | UNAUTHENTICATED；无写副作用 |
| 有效会话 + 合法 Mutation | resolve 执行；成功 data 或业务错误码 |
| 无会话 + 非 allowlist Query | UNAUTHENTICATED |
| 无会话 + allowlist 公开 Query | 可 data（仅 allowlist 字段） |
