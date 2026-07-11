# templates

> 仅允许：JSON Schema、状态矩阵 md、SQL schema 例、env 例、`package-scripts.snippet.json`、本 README。  
> **禁止**可运行发信业务实现（无 provider `.ts` / `.go` / `.py` 模块、无真密钥）。

| 文件 | 用途 |
|------|------|
| [env.example](./env.example) | 环境变量名例；staging/prod 成对、值不入库 |
| [email-template.schema.json](./email-template.schema.json) | 模板元数据 + 变量契约形状 |
| [email-message.schema.json](./email-message.schema.json) | 应用侧消息/投递记录形状 |
| [delivery-state-matrix.md](./delivery-state-matrix.md) | 合法状态转移表 |
| [schema.email.sql.example](./schema.email.sql.example) | PG 表形状例（经 Atlas 迁入实现仓） |
| [package-scripts.snippet.json](./package-scripts.snippet.json) | 脚本键名例 |
| [README.md](./README.md) | 本说明 |
