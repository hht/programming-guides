# Observability — 日志 / 指标 / 追踪指南

> **这是工程指南（规格包），不是半成品 APM 项目，也不是某家 SaaS 安装手册。**  
> **路线图定位：可选册。** 本册教「如何接日志 / 指标 / 追踪」；**其他领域指南仍不把 APM / Sentry 等第三方可观测当必勾**。  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地可关联的遥测规格。  
> **默认栈**：**OpenTelemetry** 语义约定 + **结构化 JSON 日志**；导出 **OTLP**；后端可换（Jaeger / Grafana Tempo 等），**禁**把某家商业 APM 写进默认必装。  
> **来源**：[sources.md](./sources.md)

## 品类一句话

为服务/应用接入**日志、指标、追踪**；默认必做 **logs + traces**（metrics 可选）；同一请求可用 **correlation id** 关联查询/告警；规格钉死，不绑商业 APM。

## 核心正确性路径

**Telemetry Correlate Lifecycle**（[05](./05-telemetry-correlate-lifecycle.md)）：  
`emit log/metric/trace → propagate correlation id → query/alert 可关联`。

## 本册必做 vs 非必做

| 必做（规格） | 非必做（参考） |
|--------------|----------------|
| 信号：**logs + traces**（默认）；相关 ID 生成与跨边界传播 | 购买 / 安装 Sentry、Datadog、New Relic 等；**仅 metrics** 裁剪 |
| 结构化 JSON 日志字段契约（勾 logs） | 某家 SaaS 仪表盘皮肤 |
| metrics 命名与基数上限（**仅勾 metrics 时**） | 具体托管后端品牌 |
| OTLP 导出契约（勾 traces/metrics；可指向自建 collector） | 「装了 APM」作为验收句 |

用户可感知验收例：**出错可凭 request / correlation id 追查到同请求日志与 span** — 不是「装了 Sentry」。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；按「信号裁剪」只读必读章  
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`）  
3. [03](./03-signals-and-conventions.md) + [04](./04-correlation-context.md)  
4. 落地 **Telemetry Correlate Lifecycle**（[05](./05-telemetry-correlate-lifecycle.md)）；再按需 [06](./06-structured-logs.md) / [07](./07-metrics-naming.md) / [08](./08-traces-and-otlp.md)  
5. [commands.md](./commands.md) `check` 绿  
6. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者）  

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；信号 / 相关 ID / OTLP 端点 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与禁商业 APM 必装 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-signals-and-conventions.md) | 三类信号与语义约定 |
| [04](./04-correlation-context.md) | correlation / trace context 传播 |
| [05](./05-telemetry-correlate-lifecycle.md) | **Telemetry Correlate Lifecycle** |
| [06](./06-structured-logs.md) | 结构化 JSON 日志 |
| [07](./07-metrics-naming.md) | metrics 命名与基数 |
| [08](./08-traces-and-otlp.md) | Span / OTLP 导出与查询钩子 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/P1w/差距表 |
| [templates](./templates/README.md) | env / schema 例 |
