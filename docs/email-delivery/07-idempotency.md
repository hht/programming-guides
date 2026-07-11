# 07 — 幂等

## 不变量

- **每封发送意图必填 `idempotency_key`**（INPUTS §5）；无键不得 queued/submit。  
- **同一 key 的有效出站至多一次**（at-least-once 下重复 submit 安全）。  
- 供应商幂等头（若有，例 Resend `Idempotency-Key`）= **叠加**；**不得**替代应用侧唯一约束与状态行。  
- 入队/插消息唯一约束防重复行；**不等于**已成功 submit——执行侧仍要「已 submitted/成功标记」。

## 步骤规格（实现自写）

1. **键设计**  
   - 含业务维度：`{aggregate}:{id}:{template_id}`（例 `user:42:password.reset:tok_9`）；禁仅随机 UUID（无业务去重）除非 INPUTS 书面「每次必新意图」。  
2. **意图去重**  
   - `email_messages.idempotency_key` 唯一；冲突 → `EMAIL_DUPLICATE`（默认）或 coalesce。  
3. **出站去重**  
   - submit 前：若行已 `submitted|delivered|bounced|complained` → **短路**，不再调供应商。  
   - 并行窗口：唯一约束 / 条件更新 `WHERE state = queued`；败者空操作。  
4. **供应商键**  
   - 传递**同一**应用 `idempotency_key`（或稳定哈希到供应商长度限制，须双向可追溯）；供应商 TTL 过期后应用侧约束仍有效。  
5. **禁止**  
   - 「靠少重试」代替幂等；「仅信供应商 24h TTL」无本地行。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 缺键 | 拒绝 |
| 同键不同 payload | 默认 reject（与供应商 409 语义对齐时亦拒绝） |
| 已 submitted 再执行 | 无第二次 HTTP 出站 |
| Webhook 重复 | 状态转移幂等 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 同键入队两次 | 第二次 `EMAIL_DUPLICATE` |
| Worker 执行两次 | provider HTTP 计数 = 1 |
| 崩溃重 claim | 仍出站 = 1 |
| 无键 | 被拒 |
