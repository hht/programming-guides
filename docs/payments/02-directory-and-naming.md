# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
# 实现仓建议落点（按应用册微调；词根不变）
features/checkout/ # 或 features/billing/checkout/
 create-intent/ # 创建 PaymentIntent
 confirm/ # 返回 client 确认参数（非终态）
features/payments/
 webhook/ # 验签 → 事件映射 → 状态转移
 refund/ # 退款边界命令
 receipt/ # 收据查询（用户可见）
internal/payments/ # 或 src/shared/payments/
 provider-adapter.* # 薄适配；禁 PaymentManager 作领域主名
 intent-status.* # 纯函数转移（可测）
migrations/ # payment_intents 表（对齐 postgres）
ops/
 payments.md # 可选：对账/重放说明（非 APM 必勾）
```

依赖方向：`features/checkout → provider-adapter → 提供商 SDK`；`webhook → verify → intent-status →（可选）saas billing 转移`。 
**禁** HTTP handler 内未验签直接 `UPDATE billing_status`。

UI 状态：Checkout / 收据 / 失败页状态名必须用 Pass1 词表（见 `08`）。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建或更新 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。 
2. **Intent、Checkout、Receipt、Refund、WebhookEvent** = 业务词根；禁 `PayDto`、`StripeThing`、`handlePayment*` 进领域主模块名。 
3. **禁**技术翻译名：`*PaymentManager`、`*CheckoutService`、`*WebhookHelper`（基础设施可用 `ProviderAdapter` / `WebhookRouter` 入口例外）。 
4. **禁**同义词分叉：`settle`/`capture`/`paid`/`succeeded` 词表只留业务终态名——本册默认终态成功 = **`settled`**；失败 = **`failed`**；进行中确认 = **`confirming`**；已创建未确认 = **`requires_confirmation`**（或 `open`）；退款 = **`refunded`** / **`partially_refunded`**。提供商原始状态名只出现在适配器映射表。 
5. 对外协议字段（intent id、status、amount、currency）冻结在词表。

| 概念 | 正例 | 反例 |
|------|------|------|
| 实体 | `PaymentIntent`、`Checkout`、`Receipt` | `PayDto`、`StripeSessionWrapper` |
| 操作 | `createIntent`、`confirm`、`verifyWebhook`、`settle`、`refund` | `handleStripe`、`processPayment`、`doPay` |
| 状态 | `requires_confirmation`、`confirming`、`settled`、`failed`、`refunded` | `ok`、`done`、`err_flag`、`pi_success` |
| 幂等键 | `order:{id}:pay` | 裸 UUID 无业务维度、`tmp_pay` |
| 外部引用 | `provider_intent_id` | 把 `provider_intent_id` 当业务主键到处散落 |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| 表名 | `payment_intents`（或 `{prefix}_payment_intents`）；列 `snake_case` |
| 路由 | `/payments/webhook`、`/checkout/intents`（或应用册惯例）；全文一种 |
| 环境变量 | `PAYMENT_PROVIDER`、`PAYMENT_WEBHOOK_SECRET`、`PAYMENT_SECRET_KEY`、`PAYMENT_PUBLISHABLE_KEY` |
| Go 导出 | `PascalCase`；TS/Python 跟应用册 |
