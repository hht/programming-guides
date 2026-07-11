# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层 → [typescript Language Gate](../meta/language-gates/typescript.md)（默认 Workers TS）。本文件只含 **Serverless / 边缘调用框架 MUST**。

## 品类

调用方经触发调用边缘或 Functions：**trigger → cold/warm → handler → response / timeout / retry**。

## 核心正确性路径（全文唯一）

**Invocation Lifecycle**：见 [05](./05-invocation-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 平台互斥：默认 Cloudflare Workers + TypeScript；其它仅 INPUTS 勾选 | INPUTS |
| F02 | MUST NOT | 双默认 / 双平台 SSOT | `01` / INPUTS |
| F03 | MUST | 每个部署单元一个明确 handler 入口 | `03` |
| F04 | MUST NOT | 散落隐式魔术入口无文档 | 同上 |
| F05 | MUST | 墙钟超时与 CPU 预算写明数字或 INPUTS 必填 | INPUTS / `06` |
| F06 | MUST | 超时映射为调用方可感知失败（默认 `TIMEOUT` / 504） | `07` |
| F07 | MUST NOT | 无限挂起当成功 | 同上 |
| F08 | MUST | 写路径副作用幂等可重入 | `07` / 单测 |
| F09 | MUST | Secrets / env 不进源码；staging/prod 成对 | `08` |
| F10 | MUST | 正确性不依赖「永远 warm」 | `06` |
| F11 | MUST NOT | 常驻 Node 冒充本册边缘验收（未改品类） | `01` / `11` |
| F12 | MUST | deletion-first；运维 APM 不进必勾 | `11` |

## SSOT 表

| 真相 | Owner |
|------|--------|
| 平台 / 超时 / 重试 / 触发表 | `INPUTS.md` |
| 入口与平台映射 | `03-platform-and-entry.md` |
| 触发与路由 | `04-trigger-and-routing.md` |
| Lifecycle 步骤 | `05-invocation-lifecycle.md` |
| 冷/热与预算 | `06-cold-warm-and-budget.md` |
| 超时 / 重试 / 幂等 | `07-timeout-retry-idempotency.md` |
| 响应 / 密钥 / 绑定 | `08-response-secrets-bindings.md` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |
| 全栈 Next 页/路由 | [nextjs](../nextjs/README.md) |
| 鉴权通识 | [auth](../auth/README.md) |

## 禁止（摘要）

- 「Workers 或 Vercel 都行」双开口  
- 密钥进 git / 明文日志  
- 宣称 exactly-once 却无幂等门闸  
