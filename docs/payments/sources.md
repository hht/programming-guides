# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| RFC 2104 HMAC（Webhook 签名类校验根基） | https://datatracker.ietf.org/doc/html/rfc2104 |
| OWASP API Security Top 10（对象级授权 / 安全消费） | https://owasp.org/API-Security/ |
| PCI DSS（不存原始卡数据；托管 Checkout 降责） | https://www.pcisecuritystandards.org/ |

## 标杆 B（开源 P1 + P1w 补足）

| ID | 仓库或文档 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------------|------|--------|----------|--------------|
| A | [medusajs/medusa](https://github.com/medusajs/medusa) | P1 | Payment Session / Provider 插件、捕获与退款边界、失败可查询 | 照搬 Medusa 模块目录或整站电商 | 商户侧发起支付并由提供商完成资金流 |
| B | [saleor/saleor](https://github.com/saleor/saleor) | P1 | Payment / Transaction 状态、退款、结账失败可见 | 抄 Saleor GraphQL 当唯一 API | 结账支付与交易状态对用户/商户可见 |
| C | [Stripe Payment Intents](https://docs.stripe.com/payments/payment-intents) | P1w | Intent 生命周期、confirm、Webhook 验签、收据/拒付文档 | 把 Stripe 定为指南唯一不可换默认；堆 SDK 百科 | 服务端 Intent + 客户端确认 + 签名 Webhook |

映射学习（非 B 共有证据源、不作唯一默认）：Adyen Checkout 文档、PayPal Orders API、Paddle Billing — 仅当 INPUTS 选其它商时对照事件语义。

## 共有能力切条（用户可感知）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 发起并完成付款 | ✓ | ✓ | ✓ | **必做** |
| 成功后收据 / 成功凭证可确认 | ✓ | ✓ | ✓ | **必做** |
| 付款失败可见 | ✓ | ✓ | ✓ | **必做** |
| 退款可追溯 | ✓ | ✓ | ✓ | **必做** |
| 订阅计划/席位门闸 | 可（电商） | 可 | Billing 文档 | **非本册共有** → 条件映射到 **saas**（INPUTS §10） |
| 提供商 Dashboard / APM | 可 | 可 | ✓ | **参考**（不进必勾） |

> **共有必做**仅上表用户可感知且 ≥2 源证据的能力。强制验签与 Billing 分册 SSOT **不进共有**（演示流常更弱）→ 见超越与 `11` §C。

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做/可选/参考 |
|------|------|------|------|----------------|
| Payment Intent Lifecycle 编号步骤 | A,B,C | 功能 | `05` | 必做 |
| 抽象 Checkout/Intent + Money 整数 | A,B + P0 PCI | 工程 | `03` | 必做 |
| ProviderAdapter；Stripe 仅映射 | C 完备 vs 禁百科 | 工程 | `04`/`01` | 必做 |
| 签名 Webhook + 原始 body | C + P0 HMAC | 安全 | `06` | 必做/超越 |
| settle/fail/refund 边界 | A,B,C | 功能 | `07` | 必做 |
| 收据 + 失败可见 | A,B,C | 功能 | `08` | 必做 |
| → saas BillingStatus 映射 | saas 边界 | 工程 | `08` | 条件（§10） |
| SDK 百科 / 唯一 Stripe 默认 | — | — | — | **禁止** |
| APM / Dashboard | C | 参考 | — | 参考 |

## 冲突记录

| 冲突 | 裁决 |
|------|------|
| Stripe 文档最全 vs 禁唯一商 | **抽象 Intent + 适配器**为默认栈；Stripe = INPUTS 可选映射例 |
| 客户端 return_url 当已付 | **禁止**单独 settle；须 webhook 或服务端权威 retrieve 合流 |
| 支付状态与订阅状态混表 | **分册 SSOT**：本册 Intent；saas `BillingStatus`；仅映射函数连接 |
| Hosted vs Embedded | INPUTS 互斥任选其一；默认不强制，但须写清 PCI 责任 |
| 开源电商 ≠ SaaS 席位 | 席位/计划不升格为本册共有；对接走 saas |
