# Payments — 支付集成边界指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **Checkout / Payment Intent + 签名 Webhook** 支付边界。  
> **默认栈**：**抽象 Checkout + PaymentIntent**（应用库为本仓真相）+ **签名校验 Webhook**（HMAC / 提供商等价验签）；**Stripe 仅作映射示例**（INPUTS 可换其它支付商）。**禁止**把本册写成某家 SDK 百科。  
> **与 SaaS 对齐**：计划 / 席位 / `BillingStatus` 门闸仍以 [saas `06`](../saas/06-billing-boundary.md) 为 SSOT；本册只负责 **Money Intent 生命周期 → 映射进计费状态机**。  
> **来源**：[sources.md](./sources.md)

## 品类一句话

用户为订单或订阅**发起付款**：服务端创建 Intent → 客户端确认 → 提供商签名 Webhook 验签后 settle / fail；失败与收据对用户可见；退款有明确边界。

## 核心正确性路径

**Payment Intent Lifecycle**（[05](./05-payment-intent-lifecycle.md)）：**create intent → confirm → webhook verify → settle / fail / refund boundary**（编号步骤）。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；支付商互斥已钉死  
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`）  
3. [03](./03-checkout-intent-model.md) / [04](./04-provider-adapter.md) / [05](./05-payment-intent-lifecycle.md)  
4. [06](./06-webhook-verify.md) / [07](./07-settle-fail-refund.md) / [08](./08-saas-billing-and-receipt.md)  
5. [commands.md](./commands.md) `check` 绿  
6. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者）  

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；支付商 / 金额币种 / webhook secret |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-checkout-intent-model.md) | Checkout / Intent / Money 模型 |
| [04](./04-provider-adapter.md) | 提供商适配器；Stripe 映射例 |
| [05](./05-payment-intent-lifecycle.md) | **Payment Intent Lifecycle（核心）** |
| [06](./06-webhook-verify.md) | 签名 Webhook 验签 |
| [07](./07-settle-fail-refund.md) | settle / fail / refund 边界 |
| [08](./08-saas-billing-and-receipt.md) | SaaS 计费映射 + 收据 / 失败可见 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/P1w/差距表 |
| [templates](./templates/README.md) | schema / env / 状态矩阵例 |
