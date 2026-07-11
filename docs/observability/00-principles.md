# 00 — 原则与不变量

## 品类

为服务/应用接入**日志、指标、追踪**（默认必做 logs + traces；metrics 可选）；同一请求可用 **correlation id** 关联查询/告警；规格钉死，**不绑**商业 APM。

## 路线图定位（可选册）

- 本册 = **可选**接入规格；未启用本册的应用仓，**其他领域指南仍不得**把 APM/Sentry 写进必勾。  
- 本册启用后的必做 = **可观测规格**（默认信号 **logs + traces**；相关 ID、结构化日志、OTLP 契约；**metrics 命名/基数**仅在勾 metrics 时），**不是**「必须买 / 装某家 SaaS」。**禁止**「仅 metrics」合法裁剪。

## 核心正确性路径（全文唯一）

**Telemetry Correlate Lifecycle**：  
`emit（log / metric / trace）→ propagate correlation id → query / alert 可关联`。  
规格见 [05](./05-telemetry-correlate-lifecycle.md)。

## 硬不变量

1. **标准钉死**：**OpenTelemetry** 语义约定 + Resource（`service.name` 等）；日志默认 **结构化 JSON**。  
2. **导出钉死协议**：**OTLP**；后端实现可换（Jaeger / Grafana Tempo / 自建 collector 下游），**禁**把某家商业 APM SDK 标为默认必装。  
3. **相关 ID**：每个可诊断请求有稳定 `correlation_id`（及/或 W3C `trace_id`）；跨进程/服务须传播；**勾了 logs 时日志必含**（本册默认必勾 logs）；metrics 仅在白名单低基数标签允许时纳入。  
4. **关联可验收**（与 sources / `05` / `11`§B 同构）：**勾了 logs 时**，出错后持有 id 的人能在日志（及已启用的 trace）中找到**同请求**证据 — 验收句禁止写成「已安装 Sentry」或「仅有 metrics」。  
5. **红线**：密钥、token、密码、完整 Cookie / Authorization **不得**进日志属性或 span attribute（INPUTS §8）。  
6. **基数**：metrics label 集合白名单 + 上限；禁无界 `user_id` / 原始 URL 当 label。  
7. **deletion-first**：无第二套「内部 tracing 框架」与 OTel 并行默认；无平行日志字段方言。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 信号组合 / OTLP 端点名 / 对外 id 策略 | `INPUTS.md` |
| 词表（correlation、span、metric 名） | `02` + 目标仓 `UBIQUITOUS_LANGUAGE.md` |
| 信号与语义约定 | `03-signals-and-conventions.md` |
| 上下文传播 | `04-correlation-context.md` |
| 关联生命周期步骤 | `05-telemetry-correlate-lifecycle.md` |
| 日志字段契约 | `06-structured-logs.md` |
| metrics 命名与基数 | `07-metrics-naming.md` |
| Span / OTLP | `08-traces-and-otlp.md` |

## 禁止

- 指南仓堆可运行业务 + 某家 APM 接入样板工程  
- 默认必装 Sentry / Datadog / New Relic / 同类商业 SDK  
- 生产纯文本日志无字段契约  
- 无 correlation / trace 传播的「只埋点不关联」冒充实装  
- 「仅 metrics」裁剪冒充可关联交付  
- 用高基数 label 爆炸 metrics  

## 超越（对照写入 11）

1. `对照：B 中更弱/未见「三类信号必须带同一可查询相关 ID」硬门闸 → 本指南要求 emit 后 propagate，且 query/alert 以该 ID 可关联（见 05）`  
2. `对照：B 中更弱/未见「metrics label 基数白名单+上限」硬门闸 → 本指南要求登记表白名单与无界维禁入（见 07）`  
