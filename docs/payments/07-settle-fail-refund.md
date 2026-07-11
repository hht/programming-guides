# 07 — settle / fail / refund 边界

## 不变量

- **settle**：资金/授权已获提供商成功终态；应用 `status=settled`；此后才可开通一次性履约或映射订阅 `active`。 
- **fail**：提供商明确失败或不可恢复拒绝；`status=failed`；**禁止**开通权益。 
- **refund**：仅从已 settle（或部分退款）出发；全额 → `refunded`；部分 → `partially_refunded`；须保留可审计金额。 
- 非法边见 [templates/payment-intent-state-matrix.md](./templates/payment-intent-state-matrix.md)。

## 步骤规格（实现自写）

### Settle

1. 校验 Money 与提供商事件金额一致（币种+最小单位）；不一致 → **拒转移** + 告警（对账）。 
2. 写 `settled_at`；生成 Receipt 记录（`08`）。 
3. 触发履约：发货 / entitlement / saas 映射——**同事务或 outbox**（若异步，对齐 workers-queue 幂等）。

### Fail

1. 记录 `failure_code` / `failure_message`（对内完整；对外安全裁剪）。 
2. 用户查询 API 返回失败可见状态（非空「未知」除非仍 `confirming`）。 
3. 允许用户用**新幂等键**或产品写明的重试策略重新 create（默认：新 Intent；旧行保持 failed）。

### Refund

1. 命令：`refund(intent_id, amount?)`；默认全额。 
2. `amount` 不可超过 `settled - already_refunded`。 
3. 调适配器 `createRefund`；状态可进 `refund_pending`（若需要）或等待 webhook。 
4. webhook `refunded` / `partially_refunded` 落库；更新累计退款额。 
5. 全额退款后权益回收策略：INPUTS §10+§14 写明（saas 默认倾向取消或暂停写路径）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 金额与事件不一致 | 不 settle；告警 |
| 对 `failed` 再 refund | `REFUND_NOT_ALLOWED` |
| 对 `requires_confirmation` settle | 非法边；拒绝 |
| 部分退款超额 | `REFUND_NOT_ALLOWED` |
| 退款提供商失败 | 不改 settled；返回 `PROVIDER_UNAVAILABLE` |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| settled 快乐 | 收据存在；权益/映射触发一次 |
| fail 后无权益 | entitlement 计数 0 |
| 全额退款 | `refunded`；累计退款 = amount |
| 部分退款二次 | `partially_refunded`；累计正确 |
| 金额篡改事件 | 拒 settle |
