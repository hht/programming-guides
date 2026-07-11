# 09 — 测试与 CI

> 指南不附可运行测试源码；实现仓自写。

## 单测（case → 期望）

| case | 期望 |
|------|------|
| 语法错误 / 未知字段 | 校验失败；无 resolve 副作用 |
| 无会话 Mutation | `UNAUTHENTICATED`；无写 |
| 有效会话 + 合法 Mutation | 成功 data 或业务码 |
| 缺必填输入 | `VALIDATION_FAILED`；无写 |
| 已认证无权限 | `FORBIDDEN` |
| 公开 Query allowlist | 匿名仅 allowlist 成功 |
| 错误码映射 | 校验失败 ≠ `INTERNAL` |
| prod 配置 introspection | 匿名失败 |
| SDL load | schema 构建成功 |
| codegen 漂移 | `check` 红 |

## 发版矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | Schema load + 健康 Query（可 allowlist 或测试会话） | data 形状符合 SDL |
| 2 | 匿名 Mutation | `UNAUTHENTICATED`；无副作用 |
| 3 | 鉴权后 Mutation 快乐路径 | 写成功可观测 |
| 4 | 校验失败 Mutation | `VALIDATION_FAILED`；无脏写 |
| 5 | 错误码抽样 | `extensions.code` ∈ 词表 |
| 6 | staging/prod introspection | 匿名不可用或受控策略生效 |
| 7 | Typed document 编译 | codegen + tsc/check 绿 |

## CI

| 门禁 | 何时 |
|------|------|
| 单测 | 每 PR `check` |
| `graphql-eslint` + codegen | 每 PR |
| 矩阵 1–7 | 发版必绿 |
| `check-inputs` | 每 PR |
| `check-acceptance` | 每 PR：核对 `11` **A+B+D**（**不含** C 维护者节） |
| 运维第三方 APM | **不进必勾** |
