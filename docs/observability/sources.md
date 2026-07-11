# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| OpenTelemetry 文档（概念 / 信号） | https://opentelemetry.io/docs/ |
| W3C Trace Context | https://www.w3.org/TR/trace-context/ |
| OTLP 规范 | https://opentelemetry.io/docs/specs/otlp/ |
| Semantic Conventions | https://opentelemetry.io/docs/specs/semconv/ |

## 标杆 B（证据源合计 = 3）

| ID | 仓库或文档 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------------|------|--------|----------|--------------|
| A | [open-telemetry/opentelemetry-demo](https://github.com/open-telemetry/opentelemetry-demo) | P1 | 多信号、传播、OTLP 演示与关联 | 抄整站微服务业务 | 演示应用端到端 traces/metrics/logs |
| B | [grafana/faro](https://github.com/grafana/faro) | P1 | Web 端收集、会话/错误与遥测管道习惯 | 照搬 Grafana Cloud 商业面 | 前端可观测 SDK / 管道 |
| C | [OpenTelemetry Docs](https://opentelemetry.io/docs/) | P1w | 语义约定、context 传播、信号模型 | 当唯一实现样板 | 官方如何接日志/指标/追踪 |

> 降级说明：开源应用面以 A+B 为主；官方文档 C 补足语义与传播共有描述（符合元指南「1–2 开源 + P1w 补至 3」）。

## 共有能力切条（用户可感知）

> 与 [`11`](./11-world-class-acceptance.md)§B、[`05`](./05-telemetry-correlate-lifecycle.md) **同构**：有 **logs** 时「出错可用 id 关联」必做；本册合法裁剪默认必勾 **logs + traces**（metrics 可选），故启用本册时该行恒适用。**禁止**「仅 metrics」合法化。

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 出错/请求可用 id 关联到同请求日志（及已启用 traces） | ✓ | ✓ | ✓ | **条件必做（勾 logs）** — 同构 `11`§B / `05` |
| Context / trace 传播跨边界 | ✓ | ✓/可映射 | ✓ | **条件必做**（勾 traces 或跨服务；本册默认必勾 traces） |
| 指标可观察服务行为 | ✓ | —/可映射 | ✓ | **条件必做**（勾 metrics） |
| 结构化或可查询日志/事件 | ✓ | ✓ | ✓ | **条件必做**（勾 logs；本册默认必勾） |
| 商业 SaaS APM 仪表盘 | — | 可选商业 | — | **参考**；不进必勾 |

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做 |
|------|------|------|------|------|
| Telemetry Correlate 八步 | A,C | 功能 | `05` | 必做（合法裁剪恒含 logs+traces） |
| correlation 传播 + id→日志可关联 | A,C | 功能 | `04`/`05` | 条件必做（勾 logs；与 `11`§B 同构） |
| JSON 日志字段契约 | A,B | 工程 | `06` | 条件必做（勾 logs） |
| metrics 基数门闸 | 超越/C | 工程 | `07` | 条件必做/超越（勾 metrics） |
| OTLP 可换后端 | A,C | 工程 | `01`/`08` | 条件必做（勾 traces 或 metrics） |
| 禁商业 APM 必装 | E/路线图 | 工程 | `00`/`11` | 必做（定位） |

## 冲突

| 冲突 | 裁决 |
|------|------|
| Sentry 等下载量高 vs OTel | **默认 OTel + OTLP**；商业 APM 仅参考 |
| Faro 偏 Grafana 生态 | 学收集与前端管道；**不**把 Grafana Cloud 约定必装 |
| 只埋点不关联 / 仅 metrics | **不合格**；须 `05` query 可关联（有 logs）；禁「仅 metrics」裁剪 |
| 其他领域指南是否必装 APM | **否**；本册可选，他册仍不把 APM 当必勾 |
