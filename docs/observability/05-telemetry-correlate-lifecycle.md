# 05 — Telemetry Correlate Lifecycle（核心）

> **全文唯一核心正确性路径。** 
> `emit log/metric/trace → propagate correlation id → query/alert 可关联`

## 不变量

- 任一已启用信号的 emit，必须发生在**已提取/已生成**的 correlation（及可选 span）上下文中。 
- 传播不得在服务边界默默丢失。 
- **可关联**（与 [`sources.md`](./sources.md) 共有切条、[`11`](./11-world-class-acceptance.md)§B **同构**）：**勾了 logs 时必做** — 持有 id → 能查到同请求日志（及已启用的 traces）；本册合法裁剪默认必勾 logs+traces，故启用本册时恒适用。**禁止**用「已安装某 SaaS」或「仅 metrics 仪表盘」代替本谓词。

## 步骤规格（编号固定）

| # | 步骤 | 规格 |
|---|------|------|
| 1 | **入站建立上下文** | 执行 [04](./04-correlation-context.md) extract/生成；context 必含 `correlation_id`；若勾 traces → 有有效 SpanContext（或根 span 已 start）。 |
| 2 | **emit log** | 若勾 logs：写 **JSON** 一行；**必含** `correlation_id`（及若有：`trace_id`、`span_id`）；事件名/业务字段见 [06](./06-structured-logs.md)；红线字段剥离。 |
| 3 | **emit metric** | 若勾 metrics：用登记表名；label ⊆ 白名单；**默认不把 correlation_id 当 metric label**（基数）；可用 exemplar/trace 链接若栈支持，否则靠日志+trace 关联。 |
| 4 | **emit trace** | 若勾 traces：业务/HTTP span 带约定属性；错误记 `Status`/`RecordError`；子调用前 **inject**（步骤 5）。 |
| 5 | **propagate** | 出站 HTTP/RPC/消息：inject W3C + 应用相关头（[04](./04-correlation-context.md)）；异步任务不得丢 context。 |
| 6 | **导出** | 日志 → stdout/采集；metrics/traces → **OTLP**（[08](./08-traces-and-otlp.md)）；端点来自 INPUTS；失败有界重试，**不得**反向阻断成功业务响应（除非 INPUTS 写明 fail-closed 遥测）。 |
| 7 | **query / alert 可关联** | **勾了 logs（默认必勾）**：用同一 `correlation_id`（或 `trace_id`）在日志后端与（若启用）trace 后端能命中同请求证据；告警注解/runbook 含该查询钩子（INPUTS §13）；**验收不检查 SaaS 品牌**。未勾 logs：**N/A**（非法裁剪）。 |
| 8 | **对外可追查** | 错误路径按 INPUTS §7 回显 id；支持/用户可凭该 id 开单；探针：故意 5xx → 响应含 id →（勾 logs 时）日志可 grep 到同 id — 与 sources / `11`§B 同构。 |

### 伪代码（规格级，非实现文件）

```text
handle(req):
 ctx = extract_or_create(req) # step 1 — correlation_id (+ trace)
 log.info(ctx, event="request_start") # step 2
 // ... business ...
 metrics.increment("http.server.*") # step 3 — low-cardinality labels only
 span = tracer.start(ctx, "HTTP GET") # step 4
 out = inject(ctx, downstream_headers)# step 5
 call_downstream(out)
 span.end()
 // step 6: SDK batch export via OTLP
 // step 7–8: on error, set X-Correlation-Id; runbook queries by that id
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 上下文缺失仍 emit | **禁止**；中间件顺序错误 → 测试红 |
| OTLP 不可达 | 默认丢弃/缓存在限；业务仍 2xx/4xx 正常；记内部 metric `otel.exporter.failed`（若 metrics 启用） |
| 日志无 correlation_id | 探针失败；不得合并 |
| 仅有 SaaS DSN 无 OTLP/无 id | **本册验收失败**（可选商业接入不能替代步骤 1–8） |
| 告警无查询钩子 | 发版矩阵告警行失败（若启用 §13） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 成功请求（勾 logs） | 日志含 correlation_id |
| 故意错误（勾 logs） | 响应含 id（§7 默认头）；日志同 id ≥1 条 |
| 出站调用（勾 traces） | 下游收到 traceparent 或 X-Correlation-Id |
| 跨信号（logs+traces；本册默认） | 同一请求 log.trace_id == span.trace_id |
| 无 correlation 的 emit | 测试红或自动拒绝 |
| 「只配 SaaS、无字段契约」/「仅 metrics」 | 不得标 `05` 完成 |
