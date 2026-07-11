# 06 — Provider ack 与投递状态机

## 不变量

- **应用侧状态机为投递真相**；供应商事件是输入，不是第二套平行枚举。  
- 主状态（词表冻结；禁同义词分叉）：

| 状态 | 含义 |
|------|------|
| `composed` | 已渲染；尚未持久化为发送意图（可选瞬态，可不落库） |
| `queued` | 已持久化，等待 submit（异步） |
| `submitted` | 供应商已接受请求（provider ack）；**尚未**保证送达收件箱 |
| `delivered` | 供应商报告已投递（或等价成功事件） |
| `bounced` | 硬退或最终失败退信（见 `08`） |
| `complained` | 收件人投诉/标记垃圾 |
| `failed` | 提交前/提交时永久失败（校验、拒信、超限） |
| `suppressed` | （可选）因抑制表拒绝，未出站；或仅用错误码不单列状态 |

- **合法转移**见 [templates/delivery-state-matrix.md](./templates/delivery-state-matrix.md)；非法转移 → 拒绝并度量，不静默改写。

## 步骤规格（实现自写）

### 1. Provider submit → ack

1. 适配器把 `ComposedEmail` 映到供应商 Send API。  
2. 成功：存 `provider_message_id`、原始响应摘要（禁存 API 密钥）；`queued → submitted`。  
3. 映射供应商错误：4xx 校验类 → `failed`；429/5xx → transient。

### 2. 事件推进

1. 验签后解析事件类型 → 本册枚举。  
2. 用 `provider_message_id` 查 `email_messages`；找不到 → 死信事件表/日志，**不**伪造 message。  
3. 应用转移函数 `transition(current, event) → next | reject`。  
4. **单调优先**：已 `delivered` 后迟到的 soft bounce 不降级为失败（记附注）；已 `bounced`/`complained` 后 `delivered` → reject 或人工（默认 **reject + 告警**）。

### 3. 与供应商百科解耦

- 各家事件名不同（`email.delivered` / `Delivery` / `Delivery` SNS）→ **仅适配器**做映射表；领域只见本册状态。  
- 换供应商 = 换映射 + INPUTS §1，**不**改业务 handler 状态分支。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 重复 delivered 事件 | 幂等 no-op |
| 非法转移 | 拒绝；状态不变 |
| 仅有 submitted 无后续 | 允许停留；可选 TTL 后标 `unknown`（默认**不做**；须 INPUTS 书面） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| queued→submitted | 合法 |
| submitted→delivered | 合法 |
| delivered→bounced | 非法（默认） |
| 重复事件 | 一次有效转移 |
| 映射未知事件 | 忽略或入观察表；不 500 |
