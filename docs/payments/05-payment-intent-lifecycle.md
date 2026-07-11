# 05 — Payment Intent Lifecycle（核心）

## 不变量

- 全文唯一核心路径名：**Payment Intent Lifecycle**。  
- 顺序钉死：**create intent → confirm → webhook verify → settle / fail / refund boundary**。  
- **终态权威 = 验签后的 webhook（或 INPUTS 书面允许的服务端权威 retrieve）**；客户端 confirm / success URL **不得**单独 settle。  
- 状态转移为纯函数 + 落库；非法边拒绝（见 [templates/payment-intent-state-matrix.md](./templates/payment-intent-state-matrix.md)）。

## 步骤规格（实现自写）

### 1. Create intent

1. 鉴权（Session Gate）；校验 Money / 幂等键（`03`）。  
2. 插入应用行：`status = requires_confirmation`（或 `open`）。  
3. 调 `ProviderAdapter.createIntent`；写回 `provider_intent_id` + 返回 `client_confirm_params`。  
4. 提供商失败 → 不留下「已付」；返回 `PROVIDER_UNAVAILABLE` 或删除/标记失败创建（INPUTS 钉：默认保留行 + `failed` 仅当提供商明确拒绝）。

### 2. Confirm

1. 客户端用 `client_confirm_params` 完成 Hosted / Embedded 确认（形态见 INPUTS §3）。  
2. 可选：服务端将状态推进为 `confirming`（中间态）；**禁止**在此步写 `settled`。  
3. return_url / client callback 仅用于 UX 导航与「处理中」展示；可触发**服务端 retrieve** 作加速，但仍须与后续 webhook **幂等合流**（同一终态只应用一次）。

### 3. Webhook verify

1. 接收提供商 POST：**保留原始 body**。  
2. `ProviderAdapter.verifyWebhook`（细则 `06`）。  
3. 验签失败 → **4xx**；**零**业务写。  
4. 验签成功 → `mapEvent` → 得到 `lifecycle_transition` 或 ignore。

### 4a. Settle（成功边界）

1. 仅当 transition=`settled` 且当前状态允许进入 `settled`。  
2. 落库 `status = settled`；写收据投影（`08`）。  
3. 若 INPUTS §10 启用 saas：调用映射函数 → `BillingStatus` 合法转移（saas `06`）；非法边拒绝且可告警。  
4. 重复 settled 事件 → 幂等 no-op（`PAYMENT_ALREADY_SETTLED` 对内可吞）。

### 4b. Fail（失败边界）

1. transition=`failed` 且允许进入 `failed`。  
2. 落库 `status = failed` + `failure_code`（安全裁剪后可对用户展示类）。  
3. **不**开通权益 / **不**把 BillingStatus 标为 `active`。  
4. UI：失败可见（`08`）。

### 4c. Refund boundary（退款边界）

1. 仅从 `settled`（或 `partially_refunded`）发起；规则见 `07`。  
2. 调提供商退款后，**默认仍等 webhook** 将状态推进到 `refunded` / `partially_refunded`。  
3. 退款成功映射：若 saas 启用，按 INPUTS 决定是否 `canceled` / `past_due` / 降级——**不得**静默保持 `active` 却已全额退（须书面例外）。

### 伪代码（规格级）

```text
create_intent(cmd):
  row = insert(requires_confirmation, cmd.money, cmd.idempotency_key)
  ext = adapter.createIntent(row)
  save(row.provider_intent_id = ext.id)
  return ext.client_confirm_params

confirm(client):  # UX only / optional confirming
  maybe set confirming
  # DO NOT settle here

on_webhook(raw, headers):
  event = adapter.verifyWebhook(raw, headers, secret)  # or reject
  t = adapter.mapEvent(event)
  if t == ignore: return 2xx
  apply_transition(t)  # settled | failed | refunded*
  maybe_map_billing_status(t)
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| create 时提供商挂 | 不 settle；错误码 `PROVIDER_UNAVAILABLE` |
| confirm 用户取消 | 可保持 `requires_confirmation` 或 `failed`（INPUTS）；权益不开 |
| 坏签 webhook | 4xx；状态不变 |
| 重复 succeeded | 幂等；仍 `settled` |
| 客户端宣称成功但无 webhook | 展示「处理中」；超时后服务端 retrieve 或等待；**超时预算 INPUTS**（默认 15min 内不假成功） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 快乐路径 | create→confirming?→验签 settled→收据可查 |
| 坏签 | 状态仍 requires_confirmation/confirming |
| 仅 client success、无 webhook | 不得 `settled` |
| failed 事件 | `failed`；无权益；失败对用户可查 |
| 重复 settled | 单行仍 settled；副作用一次（收据/计费映射幂等） |
| 非法边 settled→requires_confirmation | 转移拒绝 |
