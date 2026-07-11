# 04 — 触发与路由

## 不变量

- 至少一条 **HTTP** 用户可调路径（INPUTS §5）。 
- 路由名 = Pass1 业务词根；禁匿名 `/*` 唯一生产入口（除非 INPUTS 写明「单页代理」+ 下游仍按能力拆分）。 
- 每条触发在触发表有：类型、匹配规则、期望成功 status、能力名。

## 步骤规格（实现自写）

### 1. HTTP 触发

1. 注册 method + path → 能力 `route`（例 `POST /checkout/create`）。 
2. 入站：读超时预算上下文（`06`）；解析幂等头（写路径，`07`）。 
3. 出站：统一错误映射（`08`）。

### 2. 定时触发（可选）

1. Workers：`triggers.crons` / scheduled handler；OpenNext/Vercel：cron 配置；Lambda：EventBridge。 
2. cron 名进词表；handler **仍走** Lifecycle（cold/warm → handler → response/timeout/retry）。 
3. 失败按异步重试策略（INPUTS §6）。

### 3. 队列 / 其它事件（可选）

1. 绑定或事件源名进 INPUTS §11/§5。 
2. **at-least-once** 假设；副作用必须幂等（`07`）。 
3. 与 [workers-queue](../workers-queue/README.md) 边界：本册管 **函数被触发时的 Invocation**；若自建队列表认领，队列状态机以 workers-queue 为准，本册 handler 只作 execute 段。

### 4. 路由组装顺序

```text
request_id（若有）→ 鉴权（受保护）→ 校验 → 用例 → 响应编码
```

鉴权细节对齐 [auth](../auth/README.md)；公开路径跳过鉴权中间件。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 无匹配路由 | `NOT_FOUND` / 404 |
| 方法不允许 | 405 或 `VALIDATION`（全文统一一种，写进词表） |
| 触发表有路径但未实现 | CI / acceptance 红灯 |
| 异步触发无幂等 | 拒收或测试红灯 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 快乐路径 HTTP | 触发表约定 status + body 形 |
| 未知 path | 404 / NOT_FOUND |
| cron handler 抛 transient | 按 §6 可 retry（异步） |
| 写路径缺幂等键 | VALIDATION（`07`） |
