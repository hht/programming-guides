# 来源与差距

## 品类

HTTP **模型推理服务边界**：授权 → 校验 → 推理 → 响应/超时；artifact 版本钉死；超时与配额。**非**训练 / 微调 / 数据集百科。

核心路径：**Inference Request Lifecycle**。

## P0（≥3）

| 主题 | URL |
|------|-----|
| FastAPI（HTTP API / 依赖注入） | https://fastapi.tiangolo.com/ |
| ONNX Runtime — Inference | https://onnxruntime.ai/docs/get-started/with-python.html |
| Triton Model Repository（版本目录语义；协议级参考） | https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/model_repository.html |
| OpenAPI 3（契约形态参考） | https://spec.openapis.org/oas/latest.html |

## 标杆 B（3 开源）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [bentoml/BentoML](https://github.com/bentoml/BentoML) | P1 | HTTP Service API、模型加载/管理、traffic timeout | 绑死 Bento 云；把整框架当唯一业务 SSOT；训练编排 | 把模型封成可 HTTP 调用的推理服务 |
| B | [vllm-project/vllm](https://github.com/vllm-project/vllm) | P1 | OpenAI 兼容 HTTP 推理、served model name、服务超时相关配置 | 绑死仅 LLM；把采样论文当本册正文；训练 | 高性能在线推理 HTTP 服务 |
| C | [triton-inference-server/server](https://github.com/triton-inference-server/server) | P1 | Model repository 版本、HTTP 推理协议、模型配置与超时相关项 | 绑死 GPU 运维百科；把全部 backend 教程当应用分叉 | 生产级多框架推理服务器与版本化模型库 |

未入选：[kserve/kserve](https://github.com/kserve/kserve) — 偏 K8s 平台编排，与「应用内 HTTP Lifecycle」映射成本高；[SeldonIO/seldon-core](https://github.com/SeldonIO/seldon-core) — 同。可作映射学习，不进 B 计数。

## 共有能力切条（用户可感知）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 经 HTTP 调用模型得到推理结果 | ✓ | ✓ | ✓ | **必做** |
| 请求级超时可配置 | ✓ | ✓ | ✓ | **必做** |
| 以显式模型身份/版本提供服务 | ✓ | ✓ | ✓ | **必做** |
| 输入 schema / 类型校验 | ✓ | 部分 | ✓ | **必做**（≥2：A+C；B 部分；指南升格为硬校验，见 `07`；与 `11` §B 同构） |
| 请求级 authorize（API key 等） | 可 | 可 | 可 | **超越**（指南硬；示例常弱） |
| 应用侧并发/速率配额分码 | 弱/运维 | 弱/运维 | 弱/运维 | **超越**（指南硬） |
| 训练 / 微调 UI | — | — | — | **禁止**当本册必做 |
| 云托管控制台百科 | 可 | 可 | 可 | **参考**（不进必勾） |

## 差距表

| 缺口 | 来自 | 类型 | 落入文件 | 必做/可选/参考 |
|------|------|------|----------|----------------|
| Inference Request Lifecycle 编号步骤 | A,B,C | 功能/工程 | `05` | 必做 |
| HTTP 服务边界与契约 | A,B,C | 工程 | `03` | 必做 |
| Artifact 版本钉死 | A,C + P0 | 工程 | `04` | 必做 |
| authorize 步骤 1 硬门闸 | 超越 a1 | 安全 | `06`/`05` | 超越（指南硬） |
| 输入校验门闸 | A,C | 工程 | `07` | 必做 |
| 超时分码 | A,B,C | 工程 | `08` | 必做 |
| 配额硬门闸 + 分码 | 超越 a2 | 工程 | `06`/`08`/`09` | 超越（指南硬） |
| FastAPI + 单 runtime 默认栈 | P0 + 先进性 | 工程 | `01` | 必做 |
| 训练百科 | — | — | — | **禁止** |
| GPU 集群 / 厂商控制台 | — | 参考 | — | 参考；禁当正文 |

## 冲突记录

| 冲突 | 裁决 |
|------|------|
| BentoML/Triton 下载量/完整度 vs FastAPI 自写边界 | **默认 FastAPI + InferenceRuntime 端口**；标杆可学 timeout/版本/HTTP，不绑死框架为唯一实现 |
| vLLM 仅 LLM vs 通用推理品类 | vLLM 作 **HTTP 推理 + 模型名** 证据；通用路径默认 **ONNX Runtime**（INPUTS 可改 vLLM） |
| 生产用 `latest` 省事 | **禁止**作唯一解析；必须钉 semver 或 digest |
| 鉴权交给「内网」口头 | 须 INPUTS §2 书面；默认仍要应用层 authorize |
| 配额只做网关 | 网关可叠加；**应用侧仍须有可测配额语义**（单测不依赖特定网关） |
| KServe/Seldon 作第三标杆 | **否**（平台编排面）；选 Triton 补版本化 model repository |
