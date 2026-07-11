# templates

> 仅允许：JSON Schema、状态矩阵 md、env 例、package-scripts snippet、本 README。 
> **禁止**可运行业务实现（无 Checkout `.ts` / Stripe 教程模块）。

| 文件 | 用途 |
|------|------|
| [env.example](./env.example) | 环境变量名例；staging/prod 成对、值不入库 |
| [payment-intent-state-matrix.md](./payment-intent-state-matrix.md) | Intent 状态合法/非法边 |
| [webhook-event.schema.json](./webhook-event.schema.json) | 验签后内部事件形状（提供商无关） |
| [package-scripts.snippet.json](./package-scripts.snippet.json) | scripts 键名例 |
| [README.md](./README.md) | 本说明 |
