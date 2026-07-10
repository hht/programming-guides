# React 19 × EVM Web3 / DeFi 前端开发指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**从零实现世界级门槛的 EVM DeFi 前端。  
> **默认栈**：React 19 + Vite + TypeScript strict + Tailwind + TanStack Query + viem + wagmi + RainbowKit。  
> **来源**：[sources.md](./sources.md)

## Agent 执行协议

1. 校验 [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或列缺口（有缺口则停）  
2. 在目标仓库初始化默认栈；目录按 [02](./02-directory-and-naming.md)  
3. 按 [03](./03-contracts-abi-and-codegen.md) 接地址表 + ABI codegen  
4. 按 [04](./04-wallet-and-siwe.md) / [05](./05-read-write-money-path.md) / [06](./06-backend-api.md) 实现会话与钱路径（**自己写代码，勿从本目录抄业务模块**）  
5. 按设计稿 frame 逐页交付（[templates/page-state-matrix.md](./templates/page-state-matrix.md)）  
6. [commands.md](./commands.md) 门禁绿 + [11](./11-world-class-acceptance.md) 全勾  

`templates/` 只含 schema / OpenAPI stub / env 名 / 架构规则示例，见 [templates/README.md](./templates/README.md)。

## 文档索引

| 文档 | 用途 |
|------|------|
| [INPUTS.md](./INPUTS.md) | 输入门闸 |
| [00-principles.md](./00-principles.md) | 不变量 |
| [01-stack-and-react19.md](./01-stack-and-react19.md) | 栈 |
| [02-directory-and-naming.md](./02-directory-and-naming.md) | 目录 |
| [03-contracts-abi-and-codegen.md](./03-contracts-abi-and-codegen.md) | 合约 |
| [04-wallet-and-siwe.md](./04-wallet-and-siwe.md) | 钱包 / SIWE |
| [05-read-write-money-path.md](./05-read-write-money-path.md) | 钱路径规格 |
| [06-backend-api.md](./06-backend-api.md) | API |
| [07-ui-tx-ux.md](./07-ui-tx-ux.md) | UI / 交易 UX |
| [08-security-ops.md](./08-security-ops.md) | 安全 |
| [09-testing-ci.md](./09-testing-ci.md) | 测试 |
| [10-new-project-checklist.md](./10-new-project-checklist.md) | 清单 |
| [11-world-class-acceptance.md](./11-world-class-acceptance.md) | 验收 |
| [commands.md](./commands.md) | 命令 |
| [sources.md](./sources.md) | 官方来源 |
| [templates/](./templates/README.md) | 非业务：schema / stub |

## 心智模型

```text
INPUTS → 新仓建栈 → 合约/会话/钱路径规格落地 → 按 frame 做页 → check → 验收
```
