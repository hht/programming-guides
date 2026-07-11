# ML Inference — 模型推理服务边界指南

> **这是工程指南，不是半成品项目。** 
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **HTTP 模型推理服务**：先授权，再校验输入，再推理，再响应或超时；**模型 artifact 版本**；超时与配额可验证。 
> **默认栈**：**Python 3.12+** + **FastAPI**（ASGI HTTP）+ **Pydantic / JSON Schema** 输入契约 + **`model_id` + `artifact_version` 按指定版本加载** + 单一 **`InferenceRuntime` 端口**（INPUTS 互斥任选实现：ONNX Runtime / PyTorch / vLLM / Triton client / 其它书面）。**禁止**把本册写成训练 / 微调 / 数据集百科；**禁止**生产路径用浮动 `latest` 作唯一 artifact 选择。 
> **来源**：[sources.md](./sources.md)

## 品类一句话

调用方对**已约定版本**的模型发一次推理请求：系统在授权与配额内校验输入 → 执行推理 → 在时限内返回结构化结果；超时与超配额可分、可测。

## 核心正确性路径

**Inference Request Lifecycle**（[05](./05-inference-request-lifecycle.md)）：

`authorize → validate input → infer → respond / timeout`（编号步骤）

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；runtime 互斥与 artifact 版本已约定 
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`） 
3. 必读 [03](./03-http-service-boundary.md) + [04](./04-model-artifact-version.md) + [05](./05-inference-request-lifecycle.md) 
4. 落地 [06](./06-authorize-and-quota.md) / [07](./07-validate-input.md) / [08](./08-timeout-respond-errors.md) 
5. [commands.md](./commands.md) `check` 绿 
6. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者） 

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；artifact / timeout / quota / runtime |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-http-service-boundary.md) | HTTP 推理服务边界与契约 |
| [04](./04-model-artifact-version.md) | 模型 artifact 版本 |
| [05](./05-inference-request-lifecycle.md) | **Inference Request Lifecycle（核心）** |
| [06](./06-authorize-and-quota.md) | 授权与配额 |
| [07](./07-validate-input.md) | 输入校验与载荷上限 |
| [08](./08-timeout-respond-errors.md) | 超时、响应与错误分类 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | schema / env / 矩阵例 |
