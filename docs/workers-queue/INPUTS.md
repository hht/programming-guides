# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写队列 / Worker 实现**。  
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL / 表名 / P0）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **队列后端（互斥钉死一）** | □ **PostgreSQL SKIP LOCKED 队列表**（**默认**：应用已有 PG 权威源 / 对齐 [postgres](../postgres/README.md)） □ **Redis Streams**（无 PG 权威源，或 INPUTS 书面「流优先」理由）— **禁止**「PG 或 Redis 任选」双开口；**禁止**默认钉 BullMQ/Sidekiq 引擎 |
| 2 | **DATABASE_URL / REDIS_URL** | 按后端：PG → staging/prod **成对** `DATABASE_URL`（或 postgres 册钉名）；Streams → 成对 `REDIS_URL`；**值不入库** |
| 3 | **幂等键策略** | 每条 Job **必填** `idempotency_key`（业务词根+意图维度，见 `07`）；唯一性范围钉死：□ 全局 □ 按 `queue_name`；冲突行为钉死：□ **reject**（默认） □ coalesce（书面） |
| 4 | **可见性超时** | 秒数钉死（**默认 30**）或改写数字并书面；含义见 `06` |
| 5 | **最大尝试次数** | 整数钉死（**默认 5**，含首次）；超限 → 死信（`08`） |
| 6 | **退避策略** | **默认指数**：`delay = min(cap, base * 2^(attempt-1))`；`base` 默认 **1s**，`cap` 默认 **900s**；改则写入本项数字 |
| 7 | **队列名表** | ≥1 个业务队列名（例 `email.send`、`order.fulfill`）；禁 `default`/`tmp`/`queue1` 作生产唯一名 |
| 8 | **错误码表** | 至少：`JOB_DUPLICATE` / `JOB_NOT_CLAIMED` / `JOB_VISIBILITY_EXPIRED` / `JOB_DEAD` / `QUEUE_UNAVAILABLE` → 应用/HTTP 或内部映射 |
| 9 | **环境成对** | staging/prod：`APP_ENV`、后端 URL、Worker 并发度名（默认 `WORKER_CONCURRENCY`，默认值 **4**） |
| 10 | **应用册对接** | □ go □ fastapi □ nextjs □ react（仅触发入队） □ 多册 — 本册为 Job Lifecycle SSOT |

## 若适用

| # | 项 | 何时 |
|---|-----|------|
| 11 | **出站与业务同事务（PG）** | PG 后端：**默认** 业务写与 `enqueue` 同事务（Transactional Outbox / 同表插入）；若拆事务须书面 + 失败补偿 |
| 12 | **Redis 大版本** | 勾了 Streams：默认 **≥7**；consumer group 名钉死 |
| 13 | **死信保留** | 默认保留 **30 天**或直到人工 ack；改则钉数字/策略 |
| 14 | **投递语义** | 钉死 **at-least-once**（默认）；**禁止**在未实现幂等时宣称 exactly-once |
| 15 | **禁止清单确认** | 勾选：□ **不使用** `setTimeout` / 内存数组 / 单进程 channel 冒充生产队列 |
| 16 | **Streams 幂等存储（互斥钉死一）** | 勾了 Streams：□ **Redis SET + TTL**（**默认**：键对齐 §3 唯一性范围，值 = stream message id；TTL 默认对齐 §13 死信保留或钉秒数） □ **其它**（须书面理由 + 可验收谓词，例 PG 旁路表）— **禁止**「SET 或旁路表」未钉死双开口 |
| 17 | **Streams 与业务边界** | 勾了 Streams：**默认唯一**路径 = **outbox 表与业务同事务写入** + 转发器 `XADD`（转发失败可重试；**禁止**入队成功但业务未提交却已执行）；□ **其它路径**仅本项书面（理由 + 补偿/告警谓词）— **禁止**规格默认把「业务后直接 XADD / 告警+重试入队」与 outbox 并列 |

## 后端裁剪（钉死）

| 后端 | 必读章 | 可 N/A |
|------|--------|--------|
| PG SKIP LOCKED | 03（PG 节）、04–08 | 03 Redis 流细节 |
| Redis Streams | 03（Streams 节）、04–08 | 03 PG 表 DDL 细节（仍须理解状态机） |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
