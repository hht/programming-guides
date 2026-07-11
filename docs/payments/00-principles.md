# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：随宿主应用册 Language Gate（本册不另开语言百科；实现语言的 fmt/lint 跟宿主 `commands`）。

## 品类

用户发起付款：创建 Intent → 客户端确认 → Webhook 验签后 settle/fail；退款有边界。

## 核心正确性路径（全文唯一）

**Payment Intent Lifecycle**：create → confirm → webhook verify → settle/fail/refund。规格见 [05](./05-payment-intent-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 应用 Intent 状态为业务真相 | `05` |
| F02 | MUST NOT | 前端显示已付冒充 settle | e2e |
| F03 | MUST | Webhook 验签；失败不改状态 | `06` |
| F04 | MUST | settle/fail 默认仅验签后 webhook 推进 | `05`/`07` |
| F05 | MUST NOT | 客户端 confirm 单独写终态 | 同上 |
| F06 | MUST | 金额=整数最小单位+ISO4217 | 单测 |
| F07 | MUST NOT | float 账本；存卡号/CVV | PCI |
| F08 | MUST | 创建必有业务幂等键 | `03` |
| F09 | MUST | BillingStatus 映射 SSOT 在 saas `06` | `08` |
| F10 | MUST | deletion-first；无 SDK 百科 | 目录 |

## SSOT

| 真相 | Owner |
|------|--------|
| 支付商 / 密钥 / 事件 / Checkout | `INPUTS.md` |
| Intent / Money | `03` + templates |
| 适配器 | `04` |
| Lifecycle | `05` |
| Webhook | `06` |
| settle/fail/refund | `07` |
| 收据 / saas 映射 | `08` + saas `06` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md` |
