# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| PostgreSQL `SELECT … FOR UPDATE SKIP LOCKED` | https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE |
| Redis Streams | https://redis.io/docs/latest/develop/data-types/streams/ |
| Redis consumer groups | https://redis.io/docs/latest/develop/data-types/streams/streaming/#consumer-groups |

## 标杆 B（开源 P1）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [riverqueue/river](https://github.com/riverqueue/river) | P1 | PG 队列表 + `SKIP LOCKED` 认领、重试/死信形状 | 绑死 Go API / River 专有仪表 | 用 Postgres 做可靠后台 Job |
| B | [sidekiq/sidekiq](https://github.com/sidekiq/sidekiq) | P1 | 入队→Worker→重试→死信用户流；幂等/唯一 Job 习惯 | 钉 Redis+Ruby 为默认引擎；抄 Sidekiq Pro | 应用把工作丢进队列由 Worker 执行 |
| C | [taskforcesh/bullmq](https://github.com/taskforcesh/bullmq) | P1 | 锁时长/可见性、attempts、失败进 failed 集 | 钉 BullMQ/Redis 为有 PG 时的默认 | Node 应用异步 Job 与重试 |

映射学习（非 B 共有证据源、不钉默认）：Faktory 文档、Cloudflare Queues 文档 — 仅当需对照托管语义时引用。

## 共有能力切条（用户 / 运维可感知）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 提交后台任务后由 Worker 执行 | ✓ | ✓ | ✓ | **必做** |
| 失败后自动重试（有上限） | ✓ | ✓ | ✓ | **必做** |
| 超限进入失败/死信可查询 | ✓ | ✓ | ✓ | **必做** |
| 可配置尝试次数 / 退避 | ✓ | ✓ | ✓ | **必做** |
| 托管仪表盘 / APM | 可 | ✓ | 可 | **参考**（不进必勾） |

> **共有必做**仅上表用户/运维可感知且 ≥2 源证据的能力。幂等键硬必填 **不进共有**（B 中常为可选/扩展）→ 见差距表「超越」与 `11` §C a1。

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做 |
|------|------|------|------|------|
| Job Lifecycle 编号步骤 | A,B,C | 功能 | `05` | 必做 |
| PG SKIP LOCKED 认领 | A + P0 | 工程 | `03`/`06` | 条件（PG） |
| Streams + XACK / PEL | C + P0 | 工程 | `03`/`06` | 条件（Streams） |
| 入队与业务同事务 | A / 正确性 | 工程 | `04` | 必做（PG 默认） |
| 幂等键必填（非共有；B 常可选） | 超越 a1 | 工程 | `07` / `11` §C a1 | 超越（指南硬必填） |
| 可见性超时 + max attempts 钉死 | A,C | 工程 | `06`/`08`/INPUTS | 必做 |
| 禁 setTimeout 冒充队列 | 工程 | 工程 | `00`/`01` | 必做/超越 |
| APM / 第三方监控 | B | 参考 | — | 参考 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| Sidekiq / BullMQ 下载与生态更大 | **不钉为默认引擎**；作 **映射学习**（重试/死信/锁时长语义对照）。有 PG 权威源 → **钉 PG SKIP LOCKED** |
| 无 PG 时用何后端 | INPUTS 互斥选 **Redis Streams**；仍可用 BullMQ 作实现映射，但规格以本册 Streams + Lifecycle 为准 |
| River vs 自研表 | 学 River 的表状态与认领；实现可自研薄表，**禁**再引入第二套队列产品当 SSOT |
| `setTimeout` / 内存队列「先跑起来」 | **禁止**生产与本指南验收路径 |
| 宣称 exactly-once | **禁止**（未另证）；默认 **at-least-once + 幂等** |
