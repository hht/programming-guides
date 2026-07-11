# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| Redis 官方文档 | https://redis.io/docs/ |
| 分布式锁模式 | https://redis.io/docs/manual/patterns/distributed-locks/ |
| 命令参考 | https://redis.io/docs/latest/commands/ |

## 标杆 B（开源应用面 P1）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [discourse/discourse](https://github.com/discourse/discourse) | P1 | 产品侧缓存/Redis 用途边界 | 抄 Rails 整站 | 论坛用 Redis 加速读路径 |
| B | [mastodon/mastodon](https://github.com/mastodon/mastodon) | P1 | 缓存与侧车 Redis 用法 | 抄联邦协议 | 社交读路径缓存 |
| C | [outline/outline](https://github.com/outline/outline) | P1 | Node 应用 Redis 会话/缓存习惯 | 照搬 Outline 目录 | 知识库应用 Redis |

引擎/客户端事实：P0 Redis docs +（实现时）ioredis/go-redis/redis-py 按应用册；**不**单独充当「用户任务」共有证据源。

## 共有能力切条

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 用 Redis 加速读（缓存旁路或等价） | ✓ | ✓ | ✓ | 必做（勾缓存时） |
| 键过期 / TTL 治理 | ✓ | ✓ | ✓ | 必做 |
| 连接配置与环境分离 | ✓ | ✓ | ✓ | 必做 |
| 分布式锁或短互斥 | ✓/可映射 | ✓/可映射 | — | 条件必做（勾锁；缺则靠 P0 locks） |
| 限流/配额计数 | ✓/可映射 | ✓ | — | 条件必做（勾限流） |
| 会话进 Redis | 可 | 可 | ✓ | 可选（勾会话；SSOT=auth） |

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做 |
|------|------|------|------|------|
| Cache-Aside 步骤 | A,B,C | 功能 | `04` | 条件必做 |
| 写先源后失效 | 正确性/超越 | 工程 | `04` | 必做/超越 |
| token 锁 | P0 locks | 安全 | `06` | 条件必做/超越 |
| 固定窗口限流 | B,C | 功能 | `07` | 条件必做 |
| 读不可达策略须写明 | 工程 | 工程 | `INPUTS`/`04` | 必做 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| 用 redis/ioredis 仓当唯一标杆 | **否**；应用仓为 B；客户端进栈表 |
| Redis Cell 先进 | **非默认**；默认 INCR+EXPIRE |
| auth 会话 PG vs Redis | auth 默认 PG；本册 `08` 可选 |
