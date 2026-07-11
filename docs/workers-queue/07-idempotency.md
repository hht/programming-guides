# 07 — 幂等

## 不变量

- **每条 Job 必填 `idempotency_key`**（INPUTS §3）；无键不得入队。 
- Handler 必须保证：**同一 key 的有效业务副作用至多一次**（at-least-once 下重复 execute 安全）。 
- 入队唯一约束防重复行；**不等于**已执行成功——执行侧仍要「成功标记」。

## 步骤规格（实现自写）

1. **键设计** 
 - 含业务维度：`{aggregate}:{id}:{action}`（例 `order:42:fulfill`）；禁仅随机 UUID（无业务去重语义）除非 INPUTS 写明「每次必新意图」。 
2. **入队去重** 
 - DB 唯一约束 / Streams 旁路键；冲突 → `JOB_DUPLICATE`（默认）或 coalesce。 
3. **执行去重** 
 - 开始或提交副作用时写入 **`job_results(idempotency_key, status, result_ref)`**（或业务表条件更新）。 
 - 已 `succeeded` → execute 短路 → ack。 
4. **与可见性重入** 
 - 超时重 claim 可能并行窗口：用唯一约束 / 行锁 / 条件更新保证只有一胜；败者 ack 空操作或 dead 视策略（默认 **空操作 ack**）。 
5. **禁止** 
 - 「靠最大努力少重试」代替幂等；「仅入队去重」无执行标记。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 缺键 | 入队拒绝 |
| 入队重复 | `JOB_DUPLICATE` |
| 执行时发现已成功 | ack；无二次副作用 |
| 副作用非幂等 API | 须用业务侧去重票据 / upsert；否则不得上线该 job_type |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 同键入队两次 | 第二次 `JOB_DUPLICATE`（默认） |
| execute 两次同键 | 副作用计数 = 1 |
| 崩溃重 claim 后再跑 | 仍副作用 = 1 |
| 无键入队 | 被拒 |
