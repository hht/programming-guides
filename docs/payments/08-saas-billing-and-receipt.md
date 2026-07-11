# 08 — SaaS 计费映射 · 收据 · 失败可见

## 不变量

- **计费状态机 SSOT** = [saas `06-billing-boundary.md`](../saas/06-billing-boundary.md) + [billing-state-matrix](../saas/templates/billing-state-matrix.md)。本册**只**提供 `PaymentIntent` 终态 → `BillingStatus` 的映射函数。 
- **共有用户可感知**：付款完成可确认、收据可查、失败可见——三者默认必做（见 `11` §B）。 
- 无 saas（INPUTS §10=N/A）→ Billing 映射节 N/A；收据/失败可见仍必做。

## 步骤规格（实现自写）

### A. 映射到 BillingStatus（§10 启用时）

1. 定义纯函数 `mapPaymentToBilling(prev, payment_transition, plan_context) → next | Reject`。 
2. 默认建议映射（产品可改但须写入 INPUTS 并保持合法边）：

| Payment 转移 | Billing 建议 |
|--------------|--------------|
| settled（首购/换计划） | `trialing`→`active` 或 →`active` |
| failed（续费） | `active`→`past_due`（若在宽限策略内） |
| refunded（全额，周期内） | →`canceled` 或保持至 period_end（择一） |
| settled（补款） | `past_due`→`active` |

3. 调用点：仅在 Lifecycle **settle/fail/refund** 成功落库之后；与审计同事务（saas `08`）。 
4. **禁止**适配器或 webhook 处理器直接 `UPDATE tenants SET billing_status` 绕过转移函数。

### B. 收据（Receipt）

1. settle 时写 Receipt：`receipt_id`、`payment_intent_id`、Money、`settled_at`、`subject_id`、可选 `tenant_id`。 
2. 用户可查询：本人（+ 本租户授权）只读；未 settle 无收据。 
3. 展示：金额、币种、时间、状态；敏感支付工具号仅 token 末四位（若有）。

### C. 失败可见

1. Intent `failed` / 长时间 `confirming` 超时：用户可读状态 API 或页面。 
2. 对外文案用安全类（`card_declined`、`insufficient_funds`、`canceled_by_user`）；禁止回显原始栈 / 密钥。 
3. 与「处理中」区分：无 webhook 前不显示成功收据。

## 跨册边界表

| 关切 | 本册（payments） | 其它册 |
|------|------------------|--------|
| PaymentIntent Lifecycle / 验签 | **SSOT** | — |
| Plan / Seat / BillingStatus / 写门闸 | 映射输入输出 | **saas `06` SSOT** |
| Subject / Session | 引用 | **auth** |
| 异步履约 Job | 触发入队 | **workers-queue** |
| 事务邮件收据 | 可选触发 | 未来 email-delivery |
| UI 视觉 | 不写 | ui-ux / 应用册 |

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 映射非法边 | 支付状态已写则保留；Billing 不变 + 告警；人工对账 |
| 无权限读他人收据 | 403 |
| §10=N/A 仍调 Billing | 编译/测试禁路径 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| settled → active | BillingStatus=`active`；有 AuditEvent（saas） |
| failed 续费 | 不因客户端成功而 active |
| 收据 | settle 后可读；fail 后无收据 |
| 失败可见 | failed Intent 用户 API 非空状态 |
| 坏签 | Billing 不变 |
