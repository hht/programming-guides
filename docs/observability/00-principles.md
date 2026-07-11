# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：随宿主应用册 Language Gate（本册不另开语言百科；实现语言的 fmt/lint 跟宿主 `commands`）。

## 品类

日志·指标·追踪可关联验收；不绑商业 APM 为默认必装。

## 核心正确性路径（全文唯一）

**Telemetry Correlate Lifecycle**：见册内 Lifecycle 章；关联可验收 ≠「已装 Sentry」。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | OTel 语义 + 结构化 JSON 日志 | `01`/`06` |
| F02 | MUST | 导出 OTLP | `01` |
| F03 | MUST NOT | 商业 APM 作为默认必装 | `11` |
| F04 | MUST | correlation/trace 传播；勾 logs 必含关联字段 | `05` |
| F05 | MUST NOT | 密钥/token 进 log/span | 安全抽检 |
| F06 | MUST | metrics 基数白名单 | `07` |
| F07 | MUST NOT | 仅 metrics 裁剪冒充完整可观测 | `11` |
| F08 | MUST | deletion-first | 目录 |

## SSOT

| 真相 | Owner |
|------|--------|
| 信号勾选 / 导出 / 采样 | `INPUTS.md` |
| 关联字段 | `02`/`05` |
| 日志 | `06` |
| 指标 | `07` |
| 追踪 | `05` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md` |
