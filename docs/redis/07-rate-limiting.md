# 07 — 限流

## 不变量

- **默认算法：固定窗口** — `INCR` + 仅在计数从 0→1（或键新建）时 `EXPIRE window_seconds`。  
- 超限 → `RATE_LIMITED`（HTTP 常见 **429**）；fail 策略：Redis 不可达时默认 **拒绝**（fail-closed）或 INPUTS 书面 fail-open。  
- **非默认**：滑动窗口近似、[Redis Cell](https://redis.io/docs/) / `CL.THROTTLE` 等——仅 INPUTS 书面选用，不得默默替换默认。

## 步骤规格（实现自写 · 固定窗口）

1. **桶键**  
   - `key = {prefix}rl:{bucket}:{window_id}`  
   - `window_id = floor(now / window_seconds)`（或等价）。  
   - `bucket` = 业务维度（`ip`、`subject`、`route`…）词表钉死。  
2. **计数**  
   - `n = INCR key`。  
   - 若 `n == 1` → `EXPIRE key window_seconds`（防无 TTL 泄漏）。  
3. **判定**  
   - 若 `n > limit` → `RATE_LIMITED`；否则放行。  
4. **响应**  
   - 宜返回剩余额度/重置秒（头或体字段名进词表）；非必须但推荐。  
5. **管道**  
   - INCR+EXPIRE 可用 pipeline；逻辑仍以「首次设置 TTL」为准。

### 伪代码（规格级）

```text
allow(bucket):
  key = prefix + "rl:" + bucket + ":" + window_id(now)
  n = INCR(key)
  if n == 1: EXPIRE(key, window_seconds)
  if n > limit: return RATE_LIMITED
  return OK
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 超限 | `RATE_LIMITED` / 429 |
| Redis 错误 | 默认拒绝（fail-closed） |
| 键无 TTL（竞态漏 EXPIRE） | 探针/补偿：存在则补 EXPIRE；CI 抽查 TTL>0 |
| 改用 Cell | 须 INPUTS 非默认声明 + 测矩阵改写 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 窗口内第 1..limit 次 | 放行 |
| 第 limit+1 次 | `RATE_LIMITED` |
| 新窗口 | 计数重置可放行 |
| 限流键 | TTL > 0 |
