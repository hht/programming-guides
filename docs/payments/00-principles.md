# 00 — 原则与不变量

## 品类

用户为订单或订阅**发起付款**：服务端创建 Intent → 客户端确认 → 提供商签名 Webhook 验签后 settle / fail；失败与收据对用户可见；退款有明确边界。

## 核心正确性路径（全文唯一）

**Payment Intent Lifecycle**：**create intent → confirm → webhook verify → settle / fail / refund boundary**。规格见 [05](./05-payment-intent-lifecycle.md)。验签细节见 `06`；终态/退款见 `07`；SaaS/收据见 `08`——**不替代**本路径名。

## 硬不变量

1. **应用库 Intent 状态为业务真相**；提供商对象 id 仅为外部引用。禁止前端「显示已付」冒充 settle。  
2. **Webhook 必须验签**；验签失败 → **拒收且不改状态**（默认 4xx）。  
3. **settle / fail 默认仅由验签后的 webhook（或等价服务端权威查询）推进**；客户端 confirm 成功回调**不得**单独写终态（可写 `confirming` 中间态）。  
4. **金额 = 最小货币单位整数 + ISO 4217**；禁止 float 当账本。  
5. **不存原始卡号 / CVV / 磁道**；Checkout 形态决定 PCI 责任（Hosted 优先降责）。  
6. **创建 Intent 必有业务幂等键**；同一意图不因重试产生双收费真相。  
7. **与 saas 分界**：本册不重钉 `BillingStatus` / 席位门闸；映射函数见 `08`，SSOT 在 [saas `06`](../saas/06-billing-boundary.md)。  
8. **deletion-first**：无平行第二套「支付状态枚举」；无 `*PaymentManager` 领域主名；**禁止**指南仓堆某家 SDK 百科式全文。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 支付商 / 密钥名 / 事件名 / Checkout 形态 | `INPUTS.md` |
| Checkout / Intent / Money 形状 | `03-checkout-intent-model.md` + templates |
| 提供商适配接口与映射 | `04-provider-adapter.md` |
| Lifecycle 步骤 | `05-payment-intent-lifecycle.md` |
| Webhook 验签 | `06-webhook-verify.md` |
| settle / fail / refund 边界 | `07-settle-fail-refund.md` |
| BillingStatus 映射 + 收据可见 | `08-saas-billing-and-receipt.md` + saas `06` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止

- 指南仓堆可运行 Checkout UI / Stripe 全量 SDK 教程  
- 验签前落库改 `settled` / 改 `BillingStatus`  
- 客户端 success URL 单独开通订阅  
- 把本册写成「仅 Stripe」且 INPUTS 不可换商  
- 重写 saas 计划/席位门闸语义  

## 超越（对照写入 11）

1. `对照：B 中部分演示流可跳过 webhook 验签或以客户端回跳当权威 → 本指南要求验签失败绝不改状态，且 settle/fail 默认仅 webhook（或服务端权威查询）推进（见 05/06）`  
2. `对照：B 中支付对象与订阅/计划状态常混写 → 本指南强制 Intent 状态与 saas BillingStatus 分册 SSOT，仅经显式映射函数连接（见 00/08 + saas 06）`  
