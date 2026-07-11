# templates

> 仅允许：SQL schema 例、env 例、状态矩阵 md、package-scripts 片段、本 README。 
> **禁止**可运行业务实现（无 extractor `.py` / DAG `.py` 业务模块）。

| 文件 | 用途 |
|------|------|
| [env.example](./env.example) | 环境变量名例；staging/prod 成对、值不入库 |
| [schema.batch_runs.sql.example](./schema.batch_runs.sql.example) | BatchRun / 水位 / Check 结果表形状 |
| [batch-run-state-matrix.md](./batch-run-state-matrix.md) | 状态合法转移 |
| [package-scripts.snippet.json](./package-scripts.snippet.json) | scripts 键名与命令字符串例 |
| [README.md](./README.md) | 本说明 |
