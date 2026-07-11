# 04 — 提供商适配器（Stripe 映射例 · 可换）

## 不变量

- 领域代码只依赖 **ProviderAdapter** 接口；提供商 SDK **不得**泄漏进 `features/` 状态机。 
- INPUTS §1 写明**恰好一个**提供商；换商 = 新适配实现 + 映射表，Lifecycle 步骤名不变。 
- **Stripe 是映射示例，不是指南唯一默认**；选其它商时本节 Stripe 表可 N/A，但须填「其它」表至同等验收密度。

## 适配器契约（实现自写）

```text
ProviderAdapter:
 createIntent(input: { amount, currency, idempotency_key, metadata })
 → { provider_intent_id, client_confirm_params }
 parseConfirmResult(client_or_return_payload) → { provider_intent_id, provider_status } # 非终态权威
 verifyWebhook(raw_body, headers, secret) → ProviderEvent | SignatureError
 mapEvent(event) → { intent_ref, lifecycle_transition } # settled | failed | refunded | ignore
 createRefund(input) → { provider_refund_id } # 可选同步；终态仍以 webhook 为准（默认）
```

## 步骤规格

1. 按 INPUTS 实现**一个**适配器；注册为唯一 `PAYMENT_PROVIDER`。 
2. 填写下方映射表（Stripe 例可直接勾选用；其它商复制空表填写）。 
3. `mapEvent` **忽略**未知事件（no-op + 可观测日志）；**禁止**未知事件改状态。 
4. metadata 至少回传应用 `payment_intent_id`（或幂等键），以便 webhook 反查行。

## Stripe 映射例（INPUTS §1=Stripe 时）

| 本册概念 | Stripe 对象 / API（例） |
|----------|-------------------------|
| createIntent | `PaymentIntent.create` 或 Checkout Session `mode=payment` / `subscription`（订阅读 saas 映射） |
| client_confirm_params | `client_secret` + publishable key |
| confirm | 客户端 `confirmPayment` / Hosted return；服务端**不**据此 settle |
| verifyWebhook | 原始 body + `Stripe-Signature` + endpoint secret → `constructEvent` |
| settled 事件 | `payment_intent.succeeded`（及 Checkout `checkout.session.completed` 若用 Session，须再确认 PI succeeded） |
| failed 事件 | `payment_intent.payment_failed` |
| refunded 事件 | `charge.refunded` / `refund.updated`（择一；须能关联回 Intent） |

> 上表字段名以 Stripe 当前公开文档为准；升级 API 时只改本映射，不改 `05` 步骤编号。

## 其它提供商（INPUTS §1=其它 时必填）

| 本册概念 | 提供商 API / 事件名 |
|----------|---------------------|
| createIntent | （须写明） |
| client_confirm_params | （须写明） |
| verifyWebhook | 算法 + 头字段名 + secret 名 |
| settled / failed / refunded | 事件名表 |

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 提供商 create 5xx / 超时 | `PROVIDER_UNAVAILABLE`；应用行可留 `requires_confirmation` 或标记可重试；**不**假 settle |
| 未知 webhook 事件 | 验签通过后 ignore；2xx（防重放风暴按提供商建议） |
| 映射表缺事件却收到 | ignore + 告警；不改状态 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| mapEvent(succeeded) | transition=`settled` |
| mapEvent(未知) | ignore；状态不变 |
| 适配器外业务代码 import SDK | 架构测试 / lint 红灯（可选但推荐） |
| 换商只改适配器 | Lifecycle 单测仍绿（用 fake adapter） |
