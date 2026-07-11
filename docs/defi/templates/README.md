# templates — 仅规格与配置碎片

本目录 **不是** 业务实现，也不是可运行项目。

允许保留：

| 文件 | 用途 |
|------|------|
| `addresses.schema.json` | 地址表 JSON Schema |
| `openapi-auth-claim.stub.yaml` | Auth/Claim 最小 API 契约 |
| `env.example` | 环境变量名 |
| `dependency-cruiser.cjs` | 依赖方向门禁示例 |
| `package-scripts.snippet.json` | 建议 scripts 名 |
| `page-state-matrix.md` | 页面三态 / DoD 规格 |

**禁止**在本目录堆 Swap/Claim/Approve/Provider 等业务实现代码。 
实现由 agent 在目标仓库按正文指南自行编写；正文里最多给 **类型签名 / 伪代码步骤**，不给完整模块。
