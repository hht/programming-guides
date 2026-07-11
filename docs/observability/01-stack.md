# 01 — 栈

> 框架 MUST 见 [`00`](./00-principles.md)。本册无独立 Language Gate；实现语言的 fmt/lint 跟宿主应用册。

| 层 | 选择 |
|----|------|
| 标准 | **[OpenTelemetry](https://opentelemetry.io/docs/)** — API + SDK + **Semantic Conventions** |
| 传播 | **W3C Trace Context**（`traceparent` / `tracestate`）；应用日志字段默认 **`correlation_id`** |
| 日志 | **结构化 JSON**（一行一条）；字段契约见 `06` |
| 导出 | **OTLP**（HTTP 或 gRPC，INPUTS 选定一种；默认 HTTP/protobuf 可接受） |
| 本地/自建后端 | **可换**：Jaeger / Grafana Tempo / Grafana LGTM 栈 / 任意 OTLP 兼容 — **不**约定商业 SaaS |
| 语言 SDK | 跟应用册：Go=`go.opentelemetry.io/otel`；JS/TS=`@opentelemetry/api` + SDK；Python=`opentelemetry-*` — **禁**同语言第二默认遥测框架 |
| 前端（可选） | 浏览器可映射 **Grafana Faro** 或 OTel JS；仍经 OTLP/collector，不改本册相关 ID 契约 |
| 商业 APM | **非默认**；若产品强绑，写入 INPUTS 为**参考接入**，**不得**替换 OTLP/相关 ID 必做规格 |

禁止：「Sentry 或 OTel 任选」开口当默认；生产无 OTLP 端点却宣称 traces 已交付；把某家 SaaS 写进 `check` 必绿项。

## 脚手架

```bash
# 1) 按应用语言安装 OpenTelemetry API + SDK + OTLP exporter（版本跟上游稳定线；lockfile 写明）
# 2) 复制 templates/env.example → 配置 OTEL_EXPORTER_OTLP_ENDPOINT / OTEL_SERVICE_NAME / APP_ENV
# 3) Resource: service.name = INPUTS §3
# 4) 本地：起任意 OTLP 接收端（Jaeger all-in-one / Tempo / collector）；勿提交商业 APM DSN 当默认
# 5) 探针：发一请求 → 日志含 correlation_id → traces 后端可见同 trace_id（本册默认必勾 logs+traces）
```

## 版本

| 项 | 策略 |
|----|------|
| OTel API/SDK | 跟随官方稳定 minor；lockfile 约定补丁 |
| Semantic Conventions | 实现登记表对齐当前稳定文档；破坏性改名=契约变更 |
| OTLP | 与 exporter 同线；端点变量名稳定 |

## 冲突裁决（写入 sources）

| 冲突 | 裁决 |
|------|------|
| 商业 APM 下载量高 | **不**单独定胜负；默认 OTel + OTLP |
| Faro vs 纯 OTel JS | 前端可选 Faro；**相关 ID / 语义约定仍以本册为准** |
| 只打点不传播 | **不合格**；须走 `05` |
