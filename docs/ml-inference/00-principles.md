# 00 — 原则与不变量

## 品类

调用方对**已钉死版本**的模型发一次推理请求：系统在授权与配额内校验输入 → 执行推理 → 在时限内返回结构化结果；超时与超配额可分、可测。

## 核心正确性路径（全文唯一）

**Inference Request Lifecycle**：**authorize → validate input → infer → respond / timeout**。规格见 [05](./05-inference-request-lifecycle.md)。HTTP 边界见 `03`；artifact 版本见 `04`；授权/配额见 `06`；输入校验见 `07`；超时/响应见 `08`——**不替代**本路径名。

## 硬不变量

1. **HTTP 推理服务边界**：本册范围 = 在线推理请求的正确性与门闸；**禁止**把训练、微调、数据集 ETL、实验跟踪写成必做正文。  
2. **Artifact 版本钉死**：进程（或可滚动单元）加载的 `model_id` + `artifact_version` 在启动/配置中显式；生产**禁止**仅靠浮动 `latest` 且无冻结 digest/semver。  
3. **先 authorize，再 validate，再 infer**：顺序不可调换；未授权不得执行重校验或推理副作用。  
4. **超时与配额同时存在**：每个请求有墙钟超时；每个主体有并发与/或速率配额；二者失败码可分。  
5. **输入契约为门闸**：不合 schema / 超载荷 → `validation_failed` / `payload_too_large`，**不**进 infer。  
6. **单一 InferenceRuntime SSOT**：INPUTS 互斥钉死一家实现；Lifecycle 与错误语义不随 runtime 分叉。  
7. **错误可分类**：超时 ≠ 校验失败 ≠ 未授权 ≠ 内部错误（见 `08`）。  
8. **deletion-first**：无第二套平行「ML 平台」SSOT；无 `*InferenceManager` 领域主名（见 `02`）。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 鉴权 / model / timeout / quota / runtime 数字与互斥 | `INPUTS.md` |
| HTTP 路径与请求/响应契约 | `03-http-service-boundary.md` + templates |
| Artifact 版本与校验 | `04-model-artifact-version.md` |
| Lifecycle 步骤 | `05-inference-request-lifecycle.md` |
| 授权与配额算法 | `06-authorize-and-quota.md` |
| 输入校验规则 | `07-validate-input.md` |
| 超时、响应、错误码 | `08-timeout-respond-errors.md` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止

- 指南仓堆可运行训练脚本 / 真模型权重 / 真 API 密钥  
- 某家 serving 框架百科替代 Lifecycle 规格  
- 跳过 authorize 的「内网就行」默认（须 INPUTS 书面）  
- 无超时或无配额的生产验收路径  
- 把本册扩成 MLOps / 特征商店 / 训练编排百科  

## 超越（对照写入 11）

1. `对照：B 中示例常弱化或省略请求级 authorize，或把鉴权留给未文档化的网关 → 本指南要求 authorize 为 Lifecycle 步骤 1，失败不得 validate/infer，并有未授权探针（见 05/06）`  
2. `对照：B 中超时常见、配额常缺或仅运维层 → 本指南要求超时与配额同为硬门闸，分码 + 发版矩阵（见 06/08/09）`  
