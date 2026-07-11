# 03 — Checkout / Intent / Money 模型

## 不变量

- **Money**：`{ amount: integer /* 最小货币单位 */, currency: ISO4217 }`；禁止 float / string 小数当真相。 
- **PaymentIntent**（应用实体）：业务主键 + `idempotency_key` + Money + `status` + 可选 `tenant_id` / `order_id` / `subject_id` + `provider` + `provider_intent_id`（可空至 create 返回）。 
- **Checkout**：一次用户付款会话的产品面包装（可指向一个 Intent，或 Hosted Session 再解析出 Intent）；**不**另起第二套金额真相。 
- 状态枚举最小集见 [templates/payment-intent-state-matrix.md](./templates/payment-intent-state-matrix.md)。

## 步骤规格（实现自写）

1. **建表 / 模型**：至少列：`id`、`idempotency_key`（唯一）、`amount`、`currency`、`status`、`provider`、`provider_intent_id`、`failure_code`（可空）、`created_at`、`updated_at`；多租户加 `tenant_id`。 
2. **创建前校验**：金额 > 0；币种在允许列表；幂等键冲突 → INPUTS 行为（reject 或返回已有行）。 
3. **Checkout 入口**：校验 Subject（对齐 auth Session Gate）；若 saas 启用则校验租户成员与 `billing:manage` 或购买权限（INPUTS 约定权限码）。 
4. **禁止**：用提供商 Dashboard 手工改状态后不回写应用库却当已 settle；用展示字符串金额做比较。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| amount ≤ 0 / 币种非法 | 400；不建 Intent |
| 幂等键冲突（默认 reject） | `PAYMENT_ALREADY_SETTLED` 或专用 `IDEMPOTENCY_CONFLICT`（INPUTS 约定）；不新建 |
| 幂等键冲突（返回已有） | 200/同构返回已有 Intent；不双写提供商 |
| 未登录创建 | `UNAUTHENTICATED`（auth） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 合法 Money 创建行 | 行存在；status=`requires_confirmation`（或等价 open） |
| float 金额入口 | 拒绝或强制换算路径测试红灯（禁静默 float） |
| 同幂等键二次 create | 按 INPUTS：reject 或同 id |
| 缺币种 | 拒绝 |
