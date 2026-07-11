# templates

> 仅允许：JSON Schema、状态/矩阵 md、env 例、`package-scripts.snippet.json`、本 README。  
> **禁止**可运行推理业务实现（无 FastAPI `main.py`、无真权重、无真密钥）。

| 文件 | 用途 |
|------|------|
| [env.example](./env.example) | 环境变量名例；staging/prod 成对、值不入库 |
| [inference-request.schema.json](./inference-request.schema.json) | 请求契约种子 |
| [inference-response.schema.json](./inference-response.schema.json) | 成功/错误响应形状种子 |
| [timeout-quota-matrix.md](./timeout-quota-matrix.md) | 超时与配额默认矩阵 |
| [package-scripts.snippet.json](./package-scripts.snippet.json) | 脚本键名例 |
| [README.md](./README.md) | 本说明 |
