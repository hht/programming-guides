# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写支付实现**。  
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL / 事件名表 / P0）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **支付商（互斥钉死一）** | □ **Stripe**（映射例见 `04`）□ **其它**（须钉：创建 Intent API 名、confirm 路径、webhook 签名算法、成功/失败/退款事件名表）。**禁止**「Stripe 或其它任选」双开口；**禁止**把某家 SDK 当指南唯一默认却不写适配边界 |
| 2 | **Money 单位** | 金额存 **最小货币单位整数**（例 USD cents）；币种 **ISO 4217**；禁止浮点金额当真相 |
| 3 | **Checkout 形态（互斥钉死一）** | □ **Hosted Checkout**（跳转提供商托管页）□ **Embedded / Elements**（本站 UI + client confirm）□ **其它**（书面 + PCI 责任边界） |
| 4 | **Webhook 验签** | staging/prod **成对** endpoint signing secret 名（例 `PAYMENT_WEBHOOK_SECRET`）；验签算法：Stripe → 提供商库 `constructEvent` 等价；其它 → HMAC-SHA256（或书面等价）+ **原始 body**；时间窗默认 **300s** |
| 5 | **幂等键** | 创建 Intent **必填**业务幂等键（例 `order:{id}:pay` / `tenant:{id}:subscribe:{period}`）；冲突默认 **reject** 或返回已有 Intent（钉死一） |
| 6 | **成功 / 失败 / 退款事件名** | 至少列：settled 触发、failed 触发、refunded 触发（Stripe 映射例见 `04`；其它须自填） |
| 7 | **错误码表** | 至少：`PAYMENT_INTENT_NOT_FOUND` / `PAYMENT_CONFIRM_FAILED` / `WEBHOOK_SIGNATURE_INVALID` / `PAYMENT_ALREADY_SETTLED` / `REFUND_NOT_ALLOWED` / `PROVIDER_UNAVAILABLE` → HTTP/应用映射 |
| 8 | **环境成对** | staging/prod：`APP_ENV`、提供商 secret / publishable key 名、webhook secret、webhook 公开 URL；**值不入库** |
| 9 | **用户可见面** | 钉死：成功 → 收据/确认页可查；失败 → 用户可见失败原因类（安全裁剪后）；禁止仅依赖前端「假装已付」 |
| 10 | **SaaS 计费对接** | □ 启用：映射到 [saas `06`](../saas/06-billing-boundary.md) `BillingStatus`（见 `08`）□ **N/A — 一次性商品/非订阅**（acceptance 写裁剪；仍须完成本册 Intent Lifecycle） |
| 11 | **应用册对接** | □ nextjs □ go □ fastapi □ react（仅发起 confirm）□ 多册 — 本册为 Payment Intent Lifecycle SSOT |

## 若适用

| # | 项 | 何时 |
|---|-----|------|
| 12 | **租户作用域** | 多租户：Intent 必含 `tenant_id`；webhook 落库前 Membership/租户存在性校验（对齐 saas） |
| 13 | **自动捕获 vs 授权后捕获** | 默认 **自动 settle（capture）**；若 authorize-only 须书面 + 捕获截止 |
| 14 | **退款策略** | 默认允许 **全额 / 部分** 退款至原 Intent；窗口天数钉死或「提供商上限内」 |
| 15 | **收据投递** | □ 站内收据页必做（默认）□ 另加事务邮件（可选；邮件细节 defer email-delivery 册） |
| 16 | **禁止清单确认** | 勾选：□ **不**存原始卡号/CVV；□ **不**在验签前改业务状态；□ **不**用客户端回调单独 settle |

## 模式裁剪（钉死）

| 勾选 | 必读章 | 可 N/A |
|------|--------|--------|
| §1=Stripe | 03–08；`04` Stripe 映射节 | `04`「其它提供商」空表（仍须理解适配接口） |
| §1=其它 | 03–08；`04` 自填映射表 | Stripe 专有字段名 |
| §10=SaaS 启用 | `08` 全章 + saas `06` | — |
| §10=N/A 非订阅 | `08` 收据/失败可见节 | `08` BillingStatus 映射表 |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
