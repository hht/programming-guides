# 01 — 默认栈

> 选栈：**先进优先**；流行度仅佐证。冲突见 [sources.md](./sources.md)。

## 一句话默认栈

**Schema-first GraphQL SDL**（契约 SSOT）+ **GraphQL Yoga** + **graphql**（js）执行层 + **graphql-eslint**（document/schema lint；持久化操作可选）+ 客户端 **graphql-codegen Typed document**。鉴权对接 **docs/auth Session Gate**。

## 分层写明

| 层 | 默认 | 禁止 / 备注 |
|----|------|-------------|
| 契约 | **SDL** `.graphql` | 禁 code-first 作默认；禁无 SDL 的「仅 TS 类型当契约」 |
| 服务（TS） | **GraphQL Yoga** | **Pothos 禁止默认**；Apollo Server 仅既有仓迁移写明的例外 |
| 执行内核 | **graphql**（graphql-js） | 与 Yoga 同进程；勿平行第二执行器 |
| Lint / 静态 | **graphql-eslint** | PR 必跑；规则集覆盖 unused fields / known directives 等 |
| 持久化操作 | 可选；staging/prod **宜启用** | 未登记 operation → 拒绝（INPUTS §12） |
| 客户端 | **Typed document**（graphql-codegen） | 禁主路径手写无类型字符串 |
| 鉴权 | **docs/auth** Session Gate / Bearer | 禁 GraphQL 端点无门闸 Mutation |
| 订阅 | INPUTS 显式；默认本切片 **N/A** | 要则另行约定传输，不挤占核心 HTTP 路径规格 |

## 脚手架（按应用册）

| 目标 | 动作 |
|------|------|
| TS（Next / Vite / 独立 API） | 应用册脚手架后：加 Yoga handler 于写明 path；schema 从 SDL load；codegen 生成客户端类型 |
| Go / Python | 本册契约（SDL + 错误码 + Lifecycle）仍适用；运行时选语言生态 schema-first 服务器，**不得**改 SDL 语义；TS 默认栈不强制换语言 |

锁版本：应用仓 lockfile 锁定；本指南不指定具体 semver 数字，约定**能力边界**。

## 环境

见 [templates/env.example](./templates/env.example)；staging/prod **成对**（INPUTS §10）。
