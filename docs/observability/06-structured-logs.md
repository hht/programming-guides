# 06 — 结构化 JSON 日志

## 不变量

- 生产默认：**一行一条 JSON**；禁无契约纯文本当默认。  
- 每条可诊断日志 **必含** `correlation_id`（及启用 traces 时的 `trace_id` / `span_id`）。  
- PII/密钥按 INPUTS §8 剥离。

## 步骤规格（实现自写）

1. **钉最小字段集**（键名可映射词表，语义不可删）  

| 字段 | 必填 | 说明 |
|------|------|------|
| `timestamp` | ✓ | RFC3339 / Unix ms，全仓一种 |
| `level` | ✓ | `debug\|info\|warn\|error`（或等价有序枚举） |
| `message` 或 `event` | ✓ | 稳定事件名优先 `event` |
| `correlation_id` | ✓ | 与 context 一致 |
| `service` | ✓ | = `service.name` |
| `trace_id` / `span_id` | 若 traces | hex 字符串 |
| `error.type` / `error.message` | 错误时 | 无栈中密钥 |

2. **选 logger**  
   - 跟应用册（zap / slog / loguru / pino 等）；输出 JSON；**禁**同服务双默认日志库。  
3. **绑定 context**  
   - 从请求 context 自动注入 correlation / trace 字段；业务只加业务键。  
4. **级别**  
   - 生产默认 `info`；`debug` 不进 prod 默认。  
5. **与 05 衔接**  
   - emit 发生在生命周期步骤 2；无 context 不得写业务错误日志冒充已关联。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 缺 correlation_id | 探针红；中间件修复 |
| 误写 Authorization | 红线剥离或测试红 |
| 巨型 payload 入日志 | 截断策略钉死（默认 2KiB 消息上限） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| info 日志 | 可 JSON.parse；含 correlation_id、service |
| error 日志 | 含 error 字段；无 token 明文 |
| 无 context 写错误业务日志 | 失败或强制注入（钉死一；默认失败） |
