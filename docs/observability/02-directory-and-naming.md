# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
# 实现仓建议落点（按应用册微调；词根不变）
internal/telemetry/ # 或 src/shared/telemetry/ — TracerProvider / Meter / Logger 装配（基础设施名允许）
 resource.go|ts|py # Resource：service.name 等
 propagate.* # 注入/提取 correlation + W3C
features/<capability>/ # 业务能力内：emit 业务相关 span/metric/log 字段
 <entity>/
ops/
 telemetry.md # 可选：查询模板 / 告警钩子（非 SaaS 必装说明）
UBIQUITOUS_LANGUAGE.md
```

依赖方向：`features/<业务> → telemetry 装配 → OTLP exporter`；**禁** handler 内直接 `console.log` 无字段契约冒充交付。 
字段 / metric 名 SSOT：本册 `06`/`07` + 目标仓词表；禁第二份「log util」分叉方言。

UI 状态矩阵：本品类默认 **N/A**（基础设施）；若错误页展示 `correlation_id`，文案词根对齐词表。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建或更新 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。 
2. **metric 名、span 名、日志事件名** = 业务能力/实体词根（`checkout`、`order.pay`），禁 `data`、`tmp`、`helper`、`process*`。 
3. **禁**技术翻译名进领域模块主名：`*TelemetryManager`、`*ObservabilityService`、`handleLog*`（装配层可用 `Telemetry` / `TracerProvider` 等基础设施例外）。 
4. **禁**同义词分叉：`correlation_id` / `request_id` / `trace_id` — 词表写清三者关系（本册默认：`correlation_id`=应用相关键；`trace_id`=W3C/OTel；对外可只暴露其一，见 INPUTS §2/§7）。 
5. 对外错误体若含 id，字段名冻结在词表。

| 概念 | 正例 | 反例 |
|------|------|------|
| 相关键 | `correlation_id` | `reqUuid`、`misc_id`、`tmpTrace` |
| Span / 操作 | `order.checkout`、`HTTP GET` | `doStuff`、`handleRequest` |
| Metric | `http.server.request.duration`（OTel）或 `checkout.attempts` | `metric1`、`cnt_tmp` |
| 日志事件 | `checkout_failed` | `error_log_helper` |
| 服务名 | `checkout-api` | `svc`、`app` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| 日志字段 | `snake_case` JSON 键（默认）；与词表一致 |
| Metric 名 | OTel 语义名优先；自定义用 `snake_case` 或 `.` 分段，全仓一种 |
| Span name | 短、稳定、低基数（路由模板而非原始 URL） |
| 环境变量 | `OTEL_EXPORTER_OTLP_ENDPOINT`、`OTEL_SERVICE_NAME`、`APP_ENV` |
| HTTP 头 | `traceparent`（W3C）；应用回显默认 `X-Correlation-Id` |
