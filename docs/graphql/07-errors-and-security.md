# 07 — 错误与安全

## 不变量

- 可预期失败 → 稳定 `extensions.code`（Pass1 词表）；禁一律 `INTERNAL`。 
- staging/prod **introspection 默认关或受控**（超越 a1；INPUTS §8）。 
- 对外错误不泄露堆栈、SQL、内部路径（development 可详）。

## 步骤规格（实现自写）

1. 实现错误映射表（与 INPUTS §7 一致）：

| 类 | 典型触发 | 对外 |
|----|----------|------|
| `UNAUTHENTICATED` | Gate 失败 | code + 可选 message |
| `FORBIDDEN` | 授权失败 | code |
| `VALIDATION_FAILED` | SDL/变量/业务校验 | code + 可选 field path |
| `NOT_FOUND` | 实体缺失 | code |
| `INTERNAL` | 非预期 | 泛化 message |
| `RATE_LIMITED` | 复杂度/限流 | code |

2. **Introspection**：`APP_ENV=development` 可开；staging/prod 关闭 Yoga/插件 introspection，或仅运维身份/内网（INPUTS 写明）。探针：匿名 introspection 在 prod 配置下失败。 
3. **深度/复杂度**：默认建议 max depth **10**、复杂度预算产品写明或 INPUTS §17；超限不执行。 
4. **OWASP GraphQL**：批量滥用 / introspection 泄露 / 注入（若拼接非参数化后端）→ 本册要求参数化 + 鉴权 + 复杂度；细节对照 P0 OWASP。 
5. HTTP：严格按 INPUTS §7（**默认 A**：业务/鉴权失败 HTTP 200 + `errors[]`；缺 query → 400）。全仓一致。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| prod 匿名 `__schema` | 拒绝或不可达 |
| resolver throw 未映射 | → `INTERNAL`；日志留内详 |
| 校验失败误标 INTERNAL | 禁止；测试覆盖码表 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| VALIDATION_FAILED 场景 | extensions.code 精确；非 INTERNAL |
| prod 配置下 introspection | 匿名失败 |
| UNAUTHENTICATED Mutation | code 稳定；无堆栈字段 |
| 超深度 query | 拒绝执行 |
