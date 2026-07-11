# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。 
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 勾；条件行见 B）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `01` 适配器边界；禁 SDK 泄漏进状态机 |
| 工具链 | [ ] | 提供商 SDK 版本；PG 与应用册一致 |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无第二套支付状态 SSOT；指南无业务实现 |
| 逻辑清晰可测 | [ ] | `05`/`06`/`09` |
| 关键路径 | [ ] | Payment Intent Lifecycle（`05`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | 验签；无 PAN/CVV；密钥不入库 |
| 无障碍 / 性能 | [ ] | 裁剪或：Checkout/收据页跟应用册 a11y；webhook p95 预算可选 |
| 运维第三方 | N/A | **不进必勾**（提供商 Dashboard / APM 仅参考） |

## B. 功能共有 → 实现仓必做

> 仅 `sources` **共有必做**（用户可感知且 ≥2 源）。验签硬门槛与分册 Billing SSOT 属 **超越**，见 §C。

| 能力 | 何时必勾 | sources（URL） | 勾选 |
|------|----------|----------------|------|
| 用户可发起并完成付款（Checkout / Intent confirm） | 全 | https://github.com/medusajs/medusa · https://github.com/saleor/saleor · https://docs.stripe.com/payments/payment-intents | [ ] |
| 付款成功后用户可确认 / 获收据类凭证 | 全 | https://github.com/medusajs/medusa · https://github.com/saleor/saleor · https://docs.stripe.com/receipts | [ ] |
| 付款失败对用户可见（非静默） | 全 | https://github.com/medusajs/medusa · https://github.com/saleor/saleor · https://docs.stripe.com/declines | [ ] |
| 退款边界（全额/部分可追溯） | 全 | https://github.com/medusajs/medusa · https://github.com/saleor/saleor · https://docs.stripe.com/refunds | [ ] |
| 映射到 saas BillingStatus | **条件** — 仅 INPUTS §10 启用 | 对齐 [saas `06`](../saas/06-billing-boundary.md)；非共有支付能力 | [ ] / N/A |

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条（用户可感知；非「整站一条」） 
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选 
3. [ ] 功能面达到：指南必做 ⊇ 所有共有 
4. [ ] 工程面：§1.2 有章节 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中部分演示流可跳过 webhook 验签或以客户端回跳当权威 → 本指南要求验签失败绝不改状态，且 settle/fail 默认仅 webhook（或服务端权威查询）推进（见 05/06）` 
 - [ ] a2. `对照：B 中支付对象与订阅/计划状态常混写 → 本指南强制 Intent 状态与 saas BillingStatus 分册 SSOT，仅经显式映射函数连接（见 00/08 + saas 06）` 
 - [ ] b. `09` 发版矩阵适用行 
 - c. N/A（证据源含开源仓，非全 P1w） 

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；支付商互斥已遵守 
- [ ] Payment Intent Lifecycle 单测绿（`05`/`09`） 
- [ ] 坏签 / 收据 / 失败可见探针绿 
- [ ] staging/prod 密钥与 webhook secret 成对（值不在仓） 
- [ ] 无客户端单独 settle；无原始卡数据 
- [ ] saas 映射已接线或标明 N/A 
