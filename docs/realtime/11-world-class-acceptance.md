# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。 
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 能力勾；条件行见 B）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `01` 显式传输；禁双默认 / 禁默认 Socket.IO |
| 工具链 | [ ] | WebSocket + JSON envelope + Go/`coder/websocket`（或映射册内约定库） |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无平行协议 / 无业务堆进指南 |
| 逻辑清晰可测 | [ ] | `04`/`05`/`06`/`09` |
| 关键路径 | [ ] | Subscription Lifecycle（`05`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | 每 subscribe authz；禁匿名私有频道 |
| 无障碍 / 性能 | [ ] | 背压 256/1MiB；心跳数字；UI 态可感知离线（客户端） |
| 运维第三方 | N/A | **不进必勾** |

## B. 功能共有 → 实现仓必做（用户可感知）

| 能力 | 何时必勾 | sources（URL） | 勾选 |
|------|----------|----------------|------|
| 订阅频道并持续收推送 | 全能力（WS 或 SSE） | https://github.com/centrifugal/centrifugo · https://github.com/discourse/discourse · https://github.com/mastodon/mastodon | [ ] |
| 私有流须登录/令牌后可见 | 全能力 | https://github.com/centrifugal/centrifugo · https://github.com/discourse/discourse · https://github.com/mastodon/mastodon | [ ] |
| 断线后恢复实时面（重连+重订） | 全能力 | https://github.com/centrifugal/centrifugo · https://github.com/discourse/discourse · https://github.com/mastodon/mastodon | [ ] |
| 取消订阅 / 离开频道 | 全能力（WS：`unsubscribe`；SSE：**关流/换流** 等价必勾；**禁**对本共有行勾 N/A） | https://github.com/centrifugal/centrifugo · https://github.com/discourse/discourse · https://github.com/mastodon/mastodon | [ ] |
| 连接保活（用户感知不掉线） | 全能力 | https://github.com/centrifugal/centrifugo · https://datatracker.ietf.org/doc/html/rfc6455 | [ ] |
| Redis 跨节点扇出 | **勾了 Redis** | https://github.com/centrifugal/centrifugo · ../redis | [ ] / N/A |
| SSE 只读流 | **勾了 SSE** | https://github.com/mastodon/mastodon · https://html.spec.whatwg.org/multipage/server-sent-events.html | [ ] / N/A |

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条 
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选 
3. [ ] 功能面达到：指南条件必做 ⊇ 所有共有 
4. [ ] 工程面：§1.2 有章节 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中更弱/未见「每次 subscribe 必须独立 authz，连接令牌不够」硬门闸 → 本指南要求默认每 subscribe 校验频道 ACL，拒绝则 SUBSCRIBE_REJECTED/FORBIDDEN_CHANNEL（见 04/05）` 
 - [ ] a2. `对照：B 中更弱/未见「出站背压上限触顶必须可测失败」硬门闸 → 本指南要求队列 256 条或 1 MiB 先触达者触发默认断开 BACKPRESSURE（见 06）` 
 - [ ] b. `09` 发版矩阵适用行 
 - c. N/A（证据源含开源仓，非全 P1w） 

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；能力裁剪已遵守 
- [ ] 核心路径 `05` 单测绿（+ `04` authz、`06` 心跳/背压） 
- [ ] `09` 矩阵适用行 
- [ ] staging/prod `REALTIME_WS_URL` 成对（值不在仓）；若 Redis/SSE 则对应 URL 成对 
- [ ] 客户端：去重 + resubscribe；无「未订阅却显示实时就绪」 
