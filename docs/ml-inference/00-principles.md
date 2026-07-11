# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：默认 Python 宿主 → [python Language Gate](../meta/language-gates/python.md)；本册不复制语言硬门闸。

## 品类

在线模型推理服务边界：授权 → 校验 → 推理；超时与配额可分码。

## 核心正确性路径（全文唯一）

**Inference Request Lifecycle**：authorize → validate → infer → respond。规格见 [05](./05-inference-request-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 范围=在线推理；训练/ETL 非本册必做 | `00`/`01` |
| F02 | MUST | artifact 显式 version；禁裸 latest 作唯一解析 | `04` |
| F03 | MUST | authorize→validate→infer 顺序不可换 | `05` |
| F04 | MUST | 超时与配额同时存在、分码 | `06`/`08` |
| F05 | MUST | 输入契约门闸；单一 InferenceRuntime SSOT | `03`/`01` |
| F06 | MUST | 错误可分类；禁裸 500 无码 | `08` |
| F07 | MUST | deletion-first | 目录 |

## SSOT

| 真相 | Owner |
|------|--------|
| model_id / artifact_version / 超时 / 配额 | `INPUTS.md` |
| 请求/响应契约 | templates + `03` |
| Lifecycle | `05` |
| 授权与配额 | `06` |
| Runtime | `01`/`04` |
| 超时/错误 | `08` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md` |
