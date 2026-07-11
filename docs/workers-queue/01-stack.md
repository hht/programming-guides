# 01 — 栈

| 层 | 选择 |
|----|------|
| **默认队列后端** | **PostgreSQL ≥16** 队列表 + **`SELECT … FOR UPDATE SKIP LOCKED`**（应用已有 PG 权威源时优先采用；对齐 [postgres](../postgres/README.md)：迁移 **Atlas**、本地 Compose） |
| **备选后端** | **Redis Streams ≥7** + consumer group（仅当 INPUTS 互斥选 Streams） |
| 映射学习（非默认） | Sidekiq（Redis+Ruby）、BullMQ（Redis+Node）、River（PG+Go）— 对照 Lifecycle / 重试语义，**不**替换上表裁决 |
| Worker 运行时 | 与应用册同语言进程或独立 worker 二进制；并发 = INPUTS `WORKER_CONCURRENCY`（默认 **4**） |
| 禁止冒充 | **`setTimeout` / 内存队列 / 无持久化 channel** 不得进入验收路径 |

禁止：留下「BullMQ 或 PG 任选」开口；有 PG 权威源却默认引入 BullMQ 当 SSOT；生产无可见性超时。

## 脚手架

```bash
# --- PG SKIP LOCKED（默认）---
# 1) 对齐 postgres 册：Compose + Atlas；复制 templates/schema.jobs.sql.example → 迁移
# 2) 配置 staging/prod DATABASE_URL（值不入库）
# 3) Worker：轮询 claim 循环（见 05/06）；并发 WORKER_CONCURRENCY

# --- Redis Streams（INPUTS 互斥选中时）---
# 1) Redis ≥7；XGROUP CREATE <stream> <group> $ MKSTREAM
# 2) 配置 REDIS_URL；Worker XREADGROUP + XACK（见 03/06）
```

## 版本

| 项 | 策略 |
|----|------|
| PostgreSQL | 大版本 **≥16**（与 postgres 册一致）；补丁跟稳定标签 |
| Redis（若 Streams） | **≥7** |
| 客户端 | 跟应用册（go-pgx / 驱动 / ioredis 等）；本册不发明第二 SQL 客户端默认 |
| 队列库 | **可选**薄封装；若引入 River/BullMQ 须映射到本册状态机且 **不得**双 SSOT |

## 冲突裁决（写入 sources）

流行度（Sidekiq/BullMQ）**不**单独定胜负；**先进 / 与权威源同库可运维**优先 → 有 PG 则 **SKIP LOCKED**。Streams 为无 PG 时的约定备选。
