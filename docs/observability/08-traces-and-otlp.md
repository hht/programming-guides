# 08 — Traces 与 OTLP

## 不变量

- Traces 经 **OTLP** 导出；后端可换，**协议不换**。 
- Span 名与属性低基数；错误 span 有 Status。 
- 与日志共享 `trace_id`（生命周期步骤 4–7）。

## 步骤规格（实现自写）

1. **TracerProvider** 
 - 启动时一次；Sampler 按 INPUTS §11；Resource 见 `03`。 
2. **自动 vs 手动** 
 - HTTP 服务端/客户端仪表优先官方 instrumentation；业务关键路径可手动 span（名=词表操作）。 
3. **属性** 
 - 语义约定；禁 PII；`http.route` 用模板。 
4. **错误** 
 - 失败：`span.SetStatus(Error)` + `RecordError`（或语言等价）；与 error 日志同 correlation/trace。 
5. **OTLP Exporter** 
 - Endpoint = env；超时/重试有界；**禁**把商业专有 intake URL 当作本册唯一默认（可额外参考接入）。 
6. **查询钩子** 
 - Runbook 一句：`trace_id=<id>` 或 UI 搜索等价；与日志 `correlation_id` 对照表写入 `ops/telemetry.md`。 
7. **关闭** 
 - 进程退出 flush（有界等待，默认 ≤5s）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| Endpoint 缺失且勾了 traces | 启动非 0 |
| 采样丢弃 | 正常；日志仍有 correlation_id |
| 后端切换（Jaeger→Tempo） | 只改 endpoint/部署；**不改**应用字段契约 |

## 单测 / 契约探针（case → 期望）

| case | 期望 |
|------|------|
| 单请求 | 至少 1 根 span（或 instrumentation 等价） |
| 错误请求 | span status error；日志同 trace_id |
| Exporter 配置 | 使用 OTLP；非「仅 SaaS SDK」 |
| Inject 出站 | 下游 span 为子或同 trace（按传播） |
