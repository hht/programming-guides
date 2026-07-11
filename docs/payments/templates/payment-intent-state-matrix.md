# PaymentIntent 状态矩阵（例）

> 实现仓可扩展中间态，但**非法边必须拒绝**；与 `05` / `07` 一致。 
> 提供商原始状态只经 `04` 映射进入下表，不直接写业务表绕过。

## 状态

| 状态 | 含义 | 用户可见建议 |
|------|------|--------------|
| `requires_confirmation` | 已创建，待确认 | 可继续支付 |
| `confirming` | 确认中（可选中间态） | 处理中 |
| `settled` | 成功终态 | 成功 + 收据 |
| `failed` | 失败终态 | 失败原因类 |
| `refund_pending` | 退款已请求（可选） | 退款处理中 |
| `partially_refunded` | 部分退款 | 收据更新 |
| `refunded` | 全额退款 | 已退款 |

## 合法转移

| from → to | 触发（例） |
|-----------|------------|
| → `requires_confirmation` | create intent |
| `requires_confirmation` → `confirming` | client confirm 开始 / 可选 |
| `requires_confirmation` → `settled` | 验签后 succeeded（跳过 confirming 允许） |
| `confirming` → `settled` | 验签后 succeeded |
| `requires_confirmation` → `failed` | 验签后 failed / 明确取消 |
| `confirming` → `failed` | 验签后 failed |
| `settled` → `refund_pending` | 发起退款（可选） |
| `settled` → `partially_refunded` | 部分退款 webhook |
| `settled` → `refunded` | 全额退款 webhook |
| `partially_refunded` → `partially_refunded` | 再次部分退款 |
| `partially_refunded` → `refunded` | 累计达全额 |
| `refund_pending` → `refunded` / `partially_refunded` | 退款 webhook |
| `refund_pending` → `settled` | 退款失败回滚（若采用） |

## 非法边（必须拒）

| from → to | 原因 |
|-----------|------|
| `failed` → `settled` | 须新 Intent（新幂等键） |
| `refunded` → `settled` | 已退款不可再当已付 |
| `requires_confirmation` → `refunded` | 未 settle 无退款 |
| `settled` → `requires_confirmation` | 终态不可回退开放 |
| `failed` → `refunded` | 无资金可退 |

## 与客户端回调

- return_url / client `succeeded` **不是**合法转移触发源。 
- 唯一默认触发：`06` 验签通过后的 `mapEvent`（或 INPUTS 允许的服务端 retrieve 与 webhook 幂等合流）。
