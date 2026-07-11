# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写可观测实现**。 
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL/字段表/P0）。 
本册为**可选册**：应用仓可不启用本册；启用则下列必填齐。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **信号组合（默认必做 logs + traces；metrics 可选）** | □ **logs**（**必勾**）□ **metrics**（可选）□ **traces**（**必勾**）— 启用本册须同时勾 **logs** 与 **traces**；metrics 可另勾。勾了的信号之间须能证明同一 `correlation_id` / `trace_id` 可跨信号查询。**禁止**「仅 metrics」及任何**缺 logs** 或**缺 traces** 的组合（见下「信号裁剪」） |
| 2 | **相关 ID 名** | 对外字段名固定（默认 **`correlation_id`**）；与 W3C `traceparent` 关系须写明：□ 同值派生 □ 独立字段并存（**默认并存**：HTTP 用 W3C；应用日志字段保留 `correlation_id`） |
| 3 | **服务身份** | `service.name`（OTel Resource）写明字符串；环境维 `deployment.environment` 名须写明（默认 `APP_ENV`） |
| 4 | **OTLP 端点变量名** | **勾了 traces 或 metrics**：staging/prod **成对**；默认 `OTEL_EXPORTER_OTLP_ENDPOINT`；**值不入库**；本地可指向 collector/Jaeger/Tempo。**均未勾**（本册合法裁剪下不会发生）：**N/A** |
| 5 | **日志形状** | **勾了 logs**：□ **JSON 一行一条**（**默认**）— 必含字段见 `06`；禁生产默认纯文本无字段契约。**未勾 logs**：**N/A**（本册合法裁剪下不会发生） |
| 6 | **metrics 登记表** | **勾了 metrics**：每条：`name`、`type`(counter/histogram/…)、`unit`、`labels` 白名单、**基数上限**（见 `07`）。**未勾 metrics**：**N/A** |
| 7 | **错误对外可追查** | 用户/调用方可感知策略择一：□ 响应头回显 `X-Correlation-Id`（**默认**）□ 响应 body 错误对象含 `correlation_id` □ 仅内部日志（须写明：支持场景如何取 id）— **禁止**「装了 SaaS 就算可追查」 |
| 8 | **PII / 密钥红线** | 禁止写入日志/属性的字段清单（至少：密码、session token、Authorization、cookie 全文、卡号）；违规 = 探针红 |
| 9 | **环境成对** | staging/prod：`APP_ENV`、（§4 非 N/A 时）`OTEL_EXPORTER_OTLP_ENDPOINT`、（若需）`OTEL_SERVICE_NAME`；值不入库 |
| 10 | **应用册对接** | □ go □ fastapi □ nextjs □ react □ node-cli □ 多册 — 本册为遥测相关 ID / 命名 / OTLP 契约 SSOT |

## 若适用

| # | 项 | 何时 |
|---|-----|------|
| 11 | **采样** | 勾了 traces：默认 □ parentbased_always_on（dev）/ □ parentbased_traceidratio（prod，比率须写明，建议 `0.1` 起并写明） |
| 12 | **前端 RUM** | Web 前端勾 traces/logs：□ 仅后端 □ 含浏览器（可映射 Faro/OTel JS）；须写明传播头是否跨 origin |
| 13 | **告警查询钩子** | 发版矩阵启用告警时：用 `correlation_id` 或 `trace_id` 的查询模板一句（后端品牌可换，**模板字段不可换**） |
| 14 | **Collector** | □ 直连后端 □ 经 OTel Collector（推荐生产）；Collector 配置不进指南仓业务实现 |

## 信号裁剪

**默认必做信号 = logs + traces**；**metrics 可选**。 
**禁止**「仅 metrics」及任何缺 logs / 缺 traces 的组合（不另开条件化特例，避免与 sources / `05` / `11`§B 分叉）。

| 勾选 | 必读章 | 可 N/A |
|------|--------|--------|
| logs+traces（**默认**） | 03–06、08；（07 标明 N/A） | 07；INPUTS §6 |
| logs+metrics+traces | 03–08 | — |

| 非法勾选 | 处理 |
|----------|------|
| 仅 metrics | **BLOCKED** — 禁止；不得用「仪表盘按 service」代替 id→日志关联 |
| 仅 logs / 仅 traces / logs+metrics（无 traces） | **BLOCKED** — 缺默认必做信号 |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
