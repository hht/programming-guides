# 08 — 重试与死信

## 不变量

- `max_attempts`（INPUTS §5，默认 **5**，含首次）钉死；达到后 **必须** dead-letter。  
- 退避默认指数（INPUTS §6）：`delay = min(cap, base * 2^(attempt-1))`，`base=1s`，`cap=900s`。  
- 死信 **可查询**；保留期默认 **30 天**（INPUTS §13）；**禁止**静默丢弃。  
- permanent 错误可 **跳过**剩余尝试直接死信。

## 步骤规格（实现自写）

### Retry

1. 捕获错误 → 分类 `transient` | `permanent`（表由实现仓维护；默认：5xx/超时/连接 = transient；4xx 校验/业务拒绝 = permanent）。  
2. `transient` 且 `attempt < max_attempts`：  
   - `state = retry_scheduled`  
   - `visible_at = now() + delay`  
   - `last_error = truncate(message)`  
3. Worker **释放**持有（PG 更新行即可；Streams：**勿 XACK**，钉死 **延迟可见 / visibility**：按退避把 PEL 条目可见时间推到 `now() + delay`（`XCLAIM` 续 idle / 等价机制），到期后再被 claim；**禁止**「再投递新 XADD」与延迟可见并列开口）。

### Dead-letter

1. `permanent` **或** `attempt >= max_attempts`：  
   - `state = dead`（PG）或 `XADD` 死信流 + `XACK` 原消息（Streams）。  
2. 保留：`payload`、`idempotency_key`、`attempt`、`last_error`、`job_type`、时间戳。  
3. **人工重放（可选）**：新 `idempotency_key` 或明确「复用键并清除 result 标记」——须 INPUTS 书面；默认只提供查询 API/SQL。

### 与 Lifecycle 衔接

- 本文件实现 `05` 的步骤 **4b / 4c**；不得另造第三失败出口（如「忽略」）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| transient 第 1 次失败 | retry；delay ≈ 1s |
| 第 N 次至上限 | dead |
| permanent | 立即 dead |
| 死信查询 | 按 queue / time / key 可列出 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 连续 transient 失败 | 经历 retry_scheduled；最终 dead；次数 = max_attempts |
| permanent | 一次失败即 dead |
| 退避 | 两次 retry 的 visible_at 间隔符合公式（允许测试加速时钟） |
| 死信保留 | dead 行/消息可查；非静默删除 |
