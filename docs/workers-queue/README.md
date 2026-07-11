# Workers / Queue — 后台任务入队·出队·重试·幂等·死信指南

> **这是工程指南，不是半成品项目。** 
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **后台任务队列**：入队、认领、执行、确认 / 重试 / 死信。 
> **默认栈**：**PostgreSQL `SELECT … FOR UPDATE SKIP LOCKED` 队列表**（应用已有 PG 权威源时优先采用；对齐 [postgres](../postgres/README.md)）或 **Redis Streams**（无 PG / INPUTS 显式选流时）；**BullMQ / Sidekiq 仅作映射学习，不作默认**。幂等键**必填**；可见性超时与最大重试写明或进 INPUTS。**禁止** `setTimeout` / 进程内数组冒充队列。 
> **来源**：[sources.md](./sources.md)

## 品类一句话

应用把可延后工作交给后台：**入队 → 出队执行 → 失败重试 → 超限死信**；同一业务意图不因至少一次投递产生重复副作用。

## 核心正确性路径

**Job Lifecycle**（[05](./05-job-lifecycle.md)）：**enqueue → claim → execute → ack / retry / dead-letter**（编号步骤）。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；按「后端互斥」只读适用章 
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`） 
3. 必读 [03](./03-backend-and-schema.md) + [04](./04-enqueue.md) + [05](./05-job-lifecycle.md)；落地 [06](./06-claim-and-visibility.md) / [07](./07-idempotency.md) / [08](./08-retry-and-dead-letter.md) 
4. [commands.md](./commands.md) `check` 绿 
5. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者） 

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；后端互斥 / 数字门闸 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-backend-and-schema.md) | PG SKIP LOCKED / Redis Streams 与表·流形状 |
| [04](./04-enqueue.md) | 入队与事务边界 |
| [05](./05-job-lifecycle.md) | **Job Lifecycle（核心）** |
| [06](./06-claim-and-visibility.md) | 认领与可见性超时 |
| [07](./07-idempotency.md) | 幂等键与副作用门闸 |
| [08](./08-retry-and-dead-letter.md) | 重试退避与死信 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | schema / env 例 |
