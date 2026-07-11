# 06 — 计费边界

> **本册钉计划/席位/状态机与「能否写」门闸，不是支付百科。**  
> Checkout / PaymentIntent / 签名 Webhook / settle·fail·refund → [`docs/payments/`](../payments/README.md)（Payment Intent Lifecycle）。本文件仍为 **BillingStatus / 席位门闸 SSOT**；payments 只经显式映射写入状态转移。

## 不变量

- 无计费（INPUTS §9=N/A）→ 本文件 N/A；acceptance 写裁剪理由。  
- 启用时：**Plan**、**Seat**、**BillingStatus** 为业务可读真相；支付商客户 id 仅为外部引用。  
- **状态机**决定写路径是否 `BILLING_INACTIVE`；禁止前端「显示已付」冒充。  
- **不**钉唯一支付商；INPUTS 勾选 Stripe 或其它。  
- 席位：邀请/加成员前检查上限；超额按 INPUTS §17（拒绝或只读降级）钉死一。

## 步骤规格（实现自写）

1. **模型**：`tenants`（或 `subscriptions`）上 `plan_code`、`seat_limit`、`billing_status`、`period_end`（可空）。  
2. **状态枚举（最小）**：`trialing` → `active` → `past_due` → `canceled`（可加 `paused`）；转移表见 [templates/billing-state-matrix.md](./templates/billing-state-matrix.md)。  
3. **写门闸**：Tenant Gate 步骤 3：若 `isWrite` 且 status ∈ 阻断集（默认 `past_due` 超宽限期、`canceled`）→ `BILLING_INACTIVE`。读是否允许：INPUTS 钉（默认读允许）。  
4. **席位**：`active` 成员数（+ pending invite 是否计入：INPUTS）≤ `seat_limit`；超限拒绝 Invite。  
5. **外部事件**：支付商 webhook → **验签**（细节 SSOT：[payments `06`](../payments/06-webhook-verify.md)）→ 映射到状态转移函数（纯函数可测）→ 落库 → 审计。验签失败 → 拒收，不改状态。  
6. **禁止**：业务代码直接调支付 SDK 绕过状态机；指南仓堆完整 Stripe Checkout UI（支付实现走 [payments](../payments/README.md)）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| `canceled` 写业务 | `BILLING_INACTIVE` |
| `past_due` 超宽限期写 | `BILLING_INACTIVE`（宽限期天数 INPUTS，默认 0 或 3） |
| `trialing` / `active` 写 | 允许（其它 Gate 步通过时） |
| 席位已满邀请 | 409 或 403（INPUTS 钉）；不创建 active 成员 |
| webhook 签名无效 | 2xx 勿改状态；返回 4xx |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| `active` 成员写 | 允许（权限另过） |
| `canceled` 写 | `BILLING_INACTIVE` |
| 席位满 + Invite | 拒绝；成员数不变 |
| 状态转移非法边 | 转移函数拒绝；库不变 |
| webhook 坏签 | 状态不变 |
