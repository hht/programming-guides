# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| GraphQL Spec | https://spec.graphql.org/ |
| GraphQL Learn | https://graphql.org/learn/ |
| OWASP GraphQL Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html |

## 标杆 B（开源 P1）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [graphql/graphql-js](https://github.com/graphql/graphql-js) | P1 | 解析/校验/执行、错误模型、schema 运行时 | 当业务目录圣经；不学其当唯一服务框架 | GraphQL 执行与类型系统参考实现 |
| B | [dotansimha/graphql-code-generator](https://github.com/dotansimha/graphql-code-generator) | P1 | Typed document、schema→客户端类型 | 绑死某一客户端插件全家桶 | 类型安全 operation 文档 |
| C | [graphql-hive/graphql-yoga](https://github.com/graphql-hive/graphql-yoga) | P1 | 轻量 JS GraphQL 服务器、插件/上下文 | 抄演示业务；不学放宽鉴权 | Schema-first 可挂载 HTTP 服务 |

## 共有能力切条

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| Schema / 类型契约 | ✓ | ✓（消费 schema） | ✓ | 必做 |
| Query 执行 | ✓ | — | ✓ | 必做 |
| Mutation 执行 | ✓ | — | ✓ | 必做 |
| Document 校验 | ✓ | ✓（eslint/插件生态） | ✓ | 必做 |
| 错误进入 `errors[]` | ✓ | — | ✓ | 必做 |
| Typed document | — | ✓ | — | **可选（共有）** → 本册 **工程钉死升必做**（默认栈 codegen） |

## 差距表

| 缺口 | 来自标杆 | 类型 | 落入文件 | 必做/可选/参考 |
|------|----------|------|----------|----------------|
| SDL 契约 SSOT + load | A,C + Spec | 功能/工程 | `03-schema-and-sdl.md` | 必做 |
| parse → validate → execute | A,C | 工程 | `05-operation-lifecycle.md` | 必做 |
| Typed document / codegen | B | 工程 | `04-operations-and-codegen.md` | 必做（升格） |
| graphql-eslint | B 生态 / 工程共识 | 工程 | `01` / `04` / `commands` | 必做 |
| 错误 `extensions.code` 分类 | A,C + OWASP | 功能/安全 | `07-errors-and-security.md` | 必做 |
| Mutation 鉴权 + 输入校验 | OWASP + 超越 | 安全 | `06-authz-and-mutations.md` | 必做/超越 |
| introspection staging/prod 关或受控 | OWASP + 超越 | 安全 | `07` / INPUTS | 必做/超越 |
| 对接 auth Session Gate | auth 册 | 工程 | `06` / `08` | 必做 |
| 持久化操作 | 工程强化 | 工程 | INPUTS §12 / `04` | 可选（宜 staging/prod） |
| Subscription | C 可映射 | 功能 | INPUTS §13 | 可选；默认 N/A |
| Apollo Server 默认 | 流行度 | — | — | **禁止新仓默认**（冲突表） |
| Pothos / code-first 默认 | 流行度 | — | — | **禁止默认** |
| APM / Sentry 类 | — | 参考 | — | 参考；**不进必勾** |

## 冲突记录

| 冲突 | 裁决 |
|------|------|
| Apollo Server 下载/认知更高 vs Yoga 更轻先进 | **钉 GraphQL Yoga**（先进性 > 流行度）；Apollo 仅既有仓迁移书面例外 |
| Pothos / code-first 开发体验流行 | **禁止作默认**；SDL SSOT；与「契约可评审、可多语言」一致 |
| 仅 codegen 强具备 Typed document（共有可选） | 本册仍 **钉 codegen 必做**（工程面 / 默认栈）；acceptance B 单列升格项 |
| GraphQL 自动 CRUD 生成器 | **禁止**无鉴权万能 CRUD；字段显式进 SDL + Mutation 门闸 |
| 生产开 introspection 便于调试 | **staging/prod 默认关或受控**（超越 a1） |
