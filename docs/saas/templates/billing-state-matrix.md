# BillingStatus 状态矩阵（例）

> 实现仓可扩展状态，但**非法边必须拒绝**；与 `06-billing-boundary.md` 一致。  
> 支付商事件只映射到下列转移，不直接改业务表绕过状态机。

## 状态

| 状态 | 含义 | 默认可写业务 |
|------|------|--------------|
| `trialing` | 试用 | 是 |
| `active` | 有效订阅 | 是 |
| `past_due` | 付款逾期 | 否（宽限期内可 INPUTS 放行读/写） |
| `canceled` | 已取消 | 否 |

## 合法转移

| from → to | 触发（例） |
|-----------|------------|
| → `trialing` | 新租户开通试用 |
| `trialing` → `active` | 首付成功 / 试用转正 |
| `trialing` → `canceled` | 试用结束未付 / 用户取消 |
| `active` → `past_due` | 续费失败 |
| `past_due` → `active` | 补款成功 |
| `past_due` → `canceled` | 宽限期结束 / 用户取消 |
| `active` → `canceled` | 用户取消 / 管理停用 |
| `canceled` → `active` | 重新订阅（新周期） |

## 非法边（必须拒）

| from → to | 原因 |
|-----------|------|
| `canceled` → `past_due` | 无进行中账单语义 |
| `trialing` → `past_due` | 未进入付费周期前不进逾期（除非产品书面定义） |

## 席位

- `seat_limit` 与 `active`（± `invited`，INPUTS）成员数比较于 Invite/加成员前。  
- 超限：拒绝（默认）或只读降级 — **不可两者并存不钉**。
