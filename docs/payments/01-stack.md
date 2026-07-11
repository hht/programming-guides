# 01 — 栈

| 层 | 选择 |
|----|------|
| **领域模型** | 应用库 **Checkout + PaymentIntent + Money**（形状见 `03`）；状态机见 templates |
| **提供商接入** | **ProviderAdapter** 薄适配（`04`）：create / confirm-params / verifyWebhook / mapEvent；**默认映射例 = Stripe PaymentIntent / Checkout Session + 签名 Webhook** |
| **可换商** | INPUTS §1 择一；换商 = 换适配实现 + 事件名表，**不**改 Lifecycle 步骤名 |
| **存储** | 与应用权威源同库（默认 **PostgreSQL**，对齐 [postgres](../postgres/README.md)）；Intent 行含外部 id、状态、金额、幂等键 |
| **禁止** | 把某一 SDK 当成全仓唯一且不可换；业务代码散落直接调 SDK 绕过适配器与状态机；float 金额 |

禁止：留下「Stripe 或 Adyen 任选」双开口不写映射表；把某家 Dashboard 操作当唯一正确性路径。

## 脚手架

```bash
# 1) 复制 templates/payment-intent-state-matrix.md + webhook-event.schema.json 语义到实现仓
# 2) 实现 ProviderAdapter（Stripe 映射例见 04；其它按 INPUTS 填表）
# 3) staging/prod：PROVIDER_SECRET / PUBLISHABLE_KEY / PAYMENT_WEBHOOK_SECRET 成对（值不入库）
# 4) 注册 webhook URL → 原始 body 验签路由（见 06）
# 5) 接线：create → client confirm → webhook → settle/fail；可选映射 saas BillingStatus（08）
```

## 版本

| 项 | 策略 |
|----|------|
| 提供商 API | 跟 INPUTS 所选的主版本 / 稳定 API；升级须回归事件映射表 |
| Stripe（若选用） | 官方服务端 SDK 当前主线；**仅作适配器实现**，不进领域类型名 |
| Postgres | 与应用册一致（建议 ≥16） |
| 客户端支付 UI | Hosted 则最小；Embedded 跟提供商当前 Elements/等价 — **禁**自研卡号表单除非 INPUTS 写明 PCI |

## 冲突裁决（写入 sources）

Stripe 文档完备 ≠ 定为唯一商；**先进边界** = 抽象 Intent + 强制验签 + 与计费状态机分册。流行 SDK 下载量不单独定胜负。
