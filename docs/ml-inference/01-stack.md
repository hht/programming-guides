# 01 — 栈

> 框架 MUST 见 [`00`](./00-principles.md)。语言硬门闸：[python Language Gate](../meta/language-gates/python.md)（默认宿主；不在本文件复述）。

| 层 | 选择 |
|----|------|
| **语言** | **Python 3.12+**（推理服务默认；与 [fastapi](../fastapi/README.md) 对齐） |
| **HTTP** | **FastAPI** + Uvicorn/Hypercorn（ASGI）；OpenAPI 由路由+模型导出 |
| **输入/输出契约** | **Pydantic v2** 模型 ⇄ JSON Schema（templates 为契约种子） |
| **模型身份** | 配置/环境：`MODEL_ID` + `ARTIFACT_VERSION`（见 `04`）；启动时解析并校验 artifact |
| **运行时** | 单一端口 `InferenceRuntime.infer(request) -> result`；INPUTS 互斥实现：**ONNX Runtime**（默认推荐通用路径）/ **PyTorch** / **vLLM** / **Triton client** / 其它书面 |
| **鉴权** | 中间件或依赖注入读取 Bearer/API key（INPUTS）；对接 auth 册时复用会话，本册不发明登录 |
| **配额** | 进程内令牌桶/信号量（单实例默认）或共享存储（多实例须在 INPUTS 写明）；语义见 `06` |
| **超时** | `asyncio.wait_for` / runtime 原生 cancel + ASGI 层超时上限与 INPUTS 一致（取更严者） |

禁止：留下「FastAPI 或 Flask 任选」「ONNX 或随便一个」双开口；生产用未约定版本的 `latest`；指南内嵌可训练循环。

## 脚手架

```bash
# 1) 复制 templates/*.schema.json → 实现仓契约；生成或手写 Pydantic 对齐
# 2) 配置 staging/prod：MODEL_ID、ARTIFACT_VERSION、鉴权密钥名、INFERENCE_TIMEOUT_SECONDS、配额
# 3) 实现 InferenceRuntime 适配器（仅 INPUTS 约定的一家）；启动时 load + 校验 digest/semver
# 4) 挂 POST 推理路由：authorize → validate → infer → respond（严格 05 顺序）
# 5) 单测：用 fake runtime；禁 CI 下载巨型权重（fixture 用最小 stub artifact）
```

## 版本

| 项 | 策略 |
|----|------|
| Python | 3.12+；lockfile（uv/poetry/pip-tools 三选一写明在实现仓） |
| FastAPI / Pydantic | 跟当前稳定主版本；破坏性升级须改契约测试 |
| ONNX Runtime / 其它 runtime | 次版本在 lockfile；与 `ARTIFACT_VERSION` 兼容矩阵写明一行 |
| 模型 artifact | **显式版本**；滚动发布 = 新版本配置 + 健康检查，禁静默替换同名 `latest` |

## 冲突裁决（写入 sources）

| 冲突 | 裁决 |
|------|------|
| BentoML / Triton 作默认框架 vs FastAPI 自写边界 | **默认 FastAPI + InferenceRuntime 端口**（工程边界清晰、可测）；BentoML/Triton/vLLM = 标杆学习 / INPUTS 可选 runtime |
| 下载量第一的 serving 全家桶 | **不**单独定胜负；Lifecycle + 版本 + 超时配额优先 |
| 多 runtime「都支持」 | **INPUTS 互斥一家**；禁止双 SSOT |
