# 06 — Claim 与可见性超时

## 不变量

- **Claim 原子**：同一 Job 在同一时刻只被一个 Worker 持有（PG：`SKIP LOCKED`；Streams：consumer group 投递 + PEL 认领）。 
- **可见性超时**（INPUTS §4，默认 **30s**）：claim 后 `visible_at` 推到未来；到期未 ack → 可被再次 claim。 
- 超时 **不是**自动成功；是 **重新可见**。

## 步骤规格（实现自写）

1. **拉批** 
 - `LIMIT` / `COUNT` = 当前空闲槽位（≤ `WORKER_CONCURRENCY`）。 
2. **PG claim** 
 - 使用 `03` 节 CTE + `FOR UPDATE SKIP LOCKED`；过滤 `visible_at <= now()` 且 state ∈ `{pending, retry_scheduled}`。 
3. **Streams claim** 
 - 新消息：`XREADGROUP … >`；超时挂起：`XAUTOCLAIM`（min-idle-time = visibility_timeout）。 
4. **心跳 / 续期（可选）** 
 - 长任务：周期性把 `visible_at` 后推（或 `XCLAIM` 续期）；**默认不续期**——要求 handler 短于超时，或 INPUTS 勾选续期并约定周期。 
5. **丢失认领** 
 - Worker 崩溃：不 ack；到期后其他 Worker claim；`attempt` 再 +1（注意与「执行失败 retry」共用上限 —— 崩溃重领也计 attempt，**默认计**；若产品要区分须在 INPUTS 写明两计数器）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 无到期 Job | 返回空 |
| 可见性内二次 claim | 不得发生（探针） |
| 可见性已过仍被原 Worker ack | 允许 ack 成功态；若已被他人 claim 成功执行 → 幂等收敛；冲突写 → `JOB_VISIBILITY_EXPIRED` / 乐观校验失败 |
| claimed_by 不匹配仍 ack | 拒绝或幂等 no-op（选定一种；默认 **拒绝** → `JOB_NOT_CLAIMED`） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 双 Worker 抢同一到期 Job | 仅一方获得行/消息 |
| 缩短超时模拟崩溃 | 第二 Worker 在到期后 claim 成功 |
| 持有期内他人 claim | 失败 / 空 |
| ack 非持有者 | `JOB_NOT_CLAIMED`（默认） |
