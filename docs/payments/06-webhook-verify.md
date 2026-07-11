# 06 — Webhook 验签

## 不变量

- **所有**会改变 PaymentIntent / BillingStatus 的提供商回调必须先验签。 
- 使用 **原始请求体**（未重新序列化的 bytes/string）；框架 JSON 中间件若破坏 body → 验签必失败，须为 webhook 路由单独保留 raw。 
- Secret **环境成对**；staging 与 prod **不得**混用；值不入库。 
- 默认校验时间窗 **300s**（防重放）；超出 → 拒收。

## 步骤规格（实现自写）

1. 路由：`POST /payments/webhook`（或 INPUTS 约定路径）；**先**读 raw body + 签名头。 
2. 调 `ProviderAdapter.verifyWebhook(raw, headers, PAYMENT_WEBHOOK_SECRET)`。 
3. Stripe 映射例：头 `Stripe-Signature` + endpoint secret → 官方 `constructEvent` 等价；失败抛 `WEBHOOK_SIGNATURE_INVALID`。 
4. 其它商：HMAC-SHA256（或写明的算法）对比；**常量时间**比较。 
5. 通过后解析事件 id；**事件 id 去重表**（可选但推荐）：同 event id 只处理一次。 
6. 进入 `mapEvent` → Lifecycle 步骤 4a/4b/4c。 
7. 处理成功返回 **2xx**；业务暂时失败可按提供商建议 5xx 以触发重试——但须保证 handler **幂等**。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 签名缺失 / 不匹配 | **4xx**；不改库；可计 metric |
| 时间戳过期 | **4xx**；不改库 |
| raw body 被 parse 破坏 | 验签失败（同坏签）；修复路由配置 |
| 验签通过但 intent 行不存在 | 2xx + 告警（或 404 按提供商重试策略择一）；**不**创建幽灵权益 |
| 重放同 event id | 幂等 2xx；不二次副作用 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 合法签名 + succeeded | → settled |
| 篡改 body | 4xx；未 settled |
| 错误 secret | 4xx |
| 同 event 重放 | 副作用计数 = 1 |
| JSON 中间件破坏 raw | 测试证明须 bypass；或集成测试红灯 |
