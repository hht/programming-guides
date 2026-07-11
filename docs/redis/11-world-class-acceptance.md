# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。 
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 能力勾；条件行见 B）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `01` 显式客户端；禁双默认 |
| 工具链 | [ ] | Redis≥7 + go-redis/ioredis/redis-py |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无平行键约定 / 无业务堆进指南 |
| 逻辑清晰可测 | [ ] | `04`/`06`/`07`/`09` |
| 关键路径 | [ ] | Cache-Aside（`04`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | 锁 token；会话无明文；密钥不入库 |
| 无障碍 / 性能 | [ ] | 裁剪：无产品 UI；TTL/限流预算见 INPUTS |
| 运维第三方 | N/A | **不进必勾** |

## B. 功能共有 → 实现仓必做（按能力）

| 能力 | 何时必勾 | sources（URL） | 勾选 |
|------|----------|----------------|------|
| 键空间 + TTL | 全能力 | https://github.com/discourse/discourse · https://github.com/mastodon/mastodon · https://github.com/outline/outline | [ ] |
| Cache-Aside 读/写 | **勾了缓存**；仅锁/限流/会话 → N/A | https://github.com/discourse/discourse · https://github.com/mastodon/mastodon · https://github.com/outline/outline | [ ] / N/A |
| 穿透/击穿/雪崩对策 | 勾了缓存 | https://github.com/discourse/discourse · https://github.com/mastodon/mastodon · https://redis.io/docs/ | [ ] / N/A |
| 分布式锁 SET NX EX | **勾了锁** | https://redis.io/docs/manual/patterns/distributed-locks/ · https://github.com/mastodon/mastodon | [ ] / N/A |
| 限流（固定窗口默认） | **勾了限流** | https://github.com/mastodon/mastodon · https://github.com/outline/outline | [ ] / N/A |
| Redis 会话（可选） | **勾了会话**；且 auth INPUTS=Redis | https://github.com/outline/outline · ../auth | [ ] / N/A |

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条 
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选 
3. [ ] 功能面达到：指南条件必做 ⊇ 所有共有 
4. [ ] 工程面：§1.2 有章节 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中更弱/未见「删锁必须持有者 token 校验」硬门闸 → 本指南要求 SET NX EX + token 校验删除，禁裸 DEL（见 06）` 
 - [ ] a2. `对照：B 中更弱/未见「写路径禁止只改缓存不改源」硬门闸 → 本指南要求先更新权威源再失效/更新缓存，除非 INPUTS 声明 ephemeral-only（见 04）` 
 - [ ] b. `09` 发版矩阵适用行 
 - c. N/A（证据源含开源仓，非全 P1w） 

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；能力裁剪已遵守 
- [ ] 核心路径 / 适用章单测绿（缓存→`04`；锁→`06` token；限流→`07`） 
- [ ] `09` 矩阵适用行 
- [ ] staging/prod `REDIS_URL` 成对（值不在仓） 
- [ ] 若 Redis 会话：auth Gate 探针仍绿 
