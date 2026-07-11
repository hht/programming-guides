# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：随宿主应用册 Language Gate（本册不另开语言百科；实现语言的 fmt/lint 跟宿主 `commands`）。

## 品类

后台任务：入队 → 出队执行 → 失败重试 → 超限死信；同一意图不因至少一次投递重复副作用。

## 核心正确性路径（全文唯一）

**Job Lifecycle**：enqueue → claim → execute → ack / retry / dead-letter。规格见 [05](./05-job-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 后端互斥：默认 PG SKIP LOCKED；否则 Redis Streams | `01`/INPUTS |
| F02 | MUST NOT | BullMQ/Sidekiq 作默认引擎 | sources |
| F03 | MUST | 每 Job 必有 idempotency_key | `07` |
| F04 | MUST | 可见性超时与 max_attempts 写明 | INPUTS/`06`/`08` |
| F05 | MUST | 默认 at-least-once；Handler 幂等 | `07` |
| F06 | MUST NOT | 无幂等宣称 exactly-once | 同上 |
| F07 | MUST | ack 在副作用成功之后 | `05` |
| F08 | MUST | 超限→死信可查询 | `08` |
| F09 | MUST NOT | setTimeout/内存数组/无持久化 channel 冒充生产队列 | `00`/`11` |
| F10 | MUST | deletion-first | 目录 |

## SSOT

| 真相 | Owner |
|------|--------|
| 后端 / 超时 / 重试 / 队列名 | `INPUTS.md` |
| 表或流形状 | `03` + templates |
| 入队事务 | `04` |
| Lifecycle | `05` |
| claim / 可见性 | `06` |
| 幂等 | `07` |
| 退避与死信 | `08` |
| PG 通识 | [postgres](../postgres/README.md) |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md` |
