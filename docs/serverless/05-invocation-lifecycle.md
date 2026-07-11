# 05 — Invocation Lifecycle（核心）

## 不变量

- 全文唯一核心路径名：**Invocation Lifecycle**。 
- 顺序固定：**trigger → cold/warm → handler → response / timeout / retry**。 
- 冷启动可发生；正确性不依赖常热。 
- 超时与失败必须结束为调用方可感知结果（响应或平台失败语义），禁止「挂起当成功」。

## 步骤规格（实现自写）

### 1. Trigger

1. 平台收到事件：HTTP request / cron / queue message（见 [04](./04-trigger-and-routing.md)）。 
2. 解析路由与 method（或事件类型）→ 选定能力入口。 
3. 若写路径：读取幂等维度（[07](./07-timeout-retry-idempotency.md)）；缺失 → 立即 `VALIDATION`，**不**进入副作用。

### 2. Cold / Warm

1. 判定实例状态（平台语义）：**cold** = 新隔离/新进程需初始化；**warm** = 复用已初始化隔离。 
2. **Cold 允许工作**：加载模块、读 env/绑定、一次性初始化（禁在每次 warm 重复昂贵全局副作用，除非幂等）。 
3. **禁止**：业务正确性假设「跳过 cold」；冷启动耗时计入墙钟预算（[06](./06-cold-warm-and-budget.md)）。 
4. 记录可测探针：同输入下 cold 与 warm **业务结果一致**（status + 关键 body 字段）。

### 3. Handler

1. 校验输入（schema / 业务规则）。 
2. 执行用例：读绑定、调下游、写副作用（须幂等可重入）。 
3. 遵守 CPU/墙钟预算；临近超时应 fail-closed（见步骤 4b），禁盲目继续写。 
4. **禁止**在 handler 内启动无托管的「后台线程」冒充队列（长任务走 workers-queue 或平台 Queue）。

### 4a. Response（成功或业务失败）

1. 映射领域结果 → HTTP status + body（或事件 ack 语义）。 
2. 错误码表见 INPUTS §8 / [08](./08-response-secrets-bindings.md)。 
3. 成功响应不得泄漏密钥；`INTERNAL` message 默认对外 `internal error`。

### 4b. Timeout

1. 墙钟或 CPU 超 INPUTS 预算 / 平台 hard limit。 
2. 行为写明：返回或产生 **`TIMEOUT`**（HTTP 默认 **504**）；**不**部分提交后假装 200（若可能部分提交 → 依赖幂等 + 补偿/查询）。 
3. 客户端 / 平台可见失败；进入步骤 4c 的前提由触发类型决定。

### 4c. Retry

1. **HTTP 同步**：默认 **平台不自动重试业务**；调用方重试 → 必须命中同一幂等键而无二次副作用。 
2. **异步**（cron/queue/Lambda 异步）：`attempt < max_attempts` 且失败为 **transient** → 按退避重投；超限 → 死信/告警面（可对接 workers-queue 死信语义；本册要求「可查询或可告警」，第三方 APM 非必勾）。 
3. **permanent**（校验失败等）→ **不**重试；立即失败响应或死信。

### 伪代码（规格级）

```text
on_invoke(event):
 route = match_trigger(event) # step 1
 if writing(route) and missing_idempotency(event):
 return fail(VALIDATION)
 ensure_runtime_ready() # step 2 cold|warm
 try:
 with deadline(INPUTS.wall_timeout):
 result = handler(route, event) # step 3
 return respond(result) # step 4a
 catch DeadlineExceeded:
 return fail(TIMEOUT) # step 4b
 catch e:
 if async_trigger and retriable(e) and attempt < max_attempts:
 schedule_retry(event, e) # step 4c
 else:
 return fail(map_error(e)) # 4a/4c permanent
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 路由命中且用例成功 | response 2xx（或触发表约定） |
| 校验失败 | VALIDATION；不副作用 |
| 墙钟/CPU 超时 | TIMEOUT / 504 |
| transient + 异步 + 未超限 | retry |
| permanent 或超限 | 失败响应或死信；禁静默丢弃 |
| cold 后业务结果与 warm 不一致 | 测试红灯（非「偶发可接受」） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 快乐路径 | trigger→handler→response；约定 status |
| 冷/热同输入 | 业务结果一致 |
| 模拟超时 | TIMEOUT；非 200 |
| 写路径缺幂等键 | VALIDATION |
| 同幂等键重试 | 副作用计数 = 1 |
| 异步 transient 至上限 | 不再无限重试；进入失败/死信面 |
