# 来源、标杆与差距表

## 证据等级

| 等级 | 含义 |
|------|------|
| **P0** | EIP / viem / wagmi / React / SIWE 官方 |
| **P1** | 世界级开源仓实践 |
| **P1w** | 闭源公开文档 |
| **E** | 本指南工程约定 |

冲突：P0 > P1 > P1w > E。

## P0（≥3）

| 主题 | URL |
|------|-----|
| viem simulateContract | https://viem.sh/docs/contract/simulateContract |
| wagmi TypeScript | https://wagmi.sh/react/typescript |
| SIWE Security | https://docs.siwe.xyz/security-considerations |
| EIP-4361 | https://eips.ethereum.org/EIPS/eip-4361 |
| EIP-6963 | https://eips.ethereum.org/EIPS/eip-6963 |
| React Compiler | https://react.dev/learn/react-compiler/introduction |
| Permit2（若选用） | https://blog.uniswap.org/permit2-integration-guide |
| WalletConnect BP | https://docs.walletconnect.network/wallet-sdk/best-practices |

## 标杆证据源 \(B\)（3 开源）

| ID | 仓库 | 等级 | 品类匹配一句 | 学什么 | 不学什么 |
|----|------|------|--------------|--------|----------|
| A | [Uniswap/interface](https://github.com/Uniswap/interface) | P1 | 生产级 Swap / 授权 / 多链 DApp | 报价门闸、授权 UX、写路径分层 | 整仓抄 UI；过时 ethers 路径 |
| B | [sushiswap/sushiswap](https://github.com/sushiswap/sushiswap) | P1 | 多产品 DeFi 前端（Swap 等） | 多路由命令面、链配置集中 | 业务代币经济学 |
| C | [aave/interface](https://github.com/aave/interface) | P1 | 借贷类钱路径 + 钱包连接 | 健康因子类门闸思维、交易态 | Aave 特有市场参数当通用 |

## 能力切条 → 共有（≥2 → 必做功能）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 连接钱包 / 切链 | ✓ | ✓ | ✓ | 共有→必做 |
| Swap（或等价兑换写路径） | ✓ | ✓ | △ | 共有→必做（C 为供给/借贷写路径，映射为「钱路径写」） |
| 代币授权 approve | ✓ | ✓ | ✓ | 共有→必做 |
| 交易 pending/success/fail 态 | ✓ | ✓ | ✓ | 共有→必做 |
| 报价或等价预览后再提交 | ✓ | ✓ | ✓ | 共有→必做 |
| 多环境/多链配置 | ✓ | ✓ | ✓ | 共有→必做 |

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做/可选/参考 |
|------|------|------|------|----------------|
| Simulate→Write→Wait | P0 viem | 工程/功能 | `05` | 必做 |
| inflight + unknown latch | E 强化 | 功能 | `05` | 必做（超越） |
| walletReady≠sessionReady | P0 SIWE | 功能 | `04` | 必做（有后端时） |
| 地址表+ABI codegen | A/B 工程面 | 工程 | `03` | 必做 |
| 发版钱路径 e2e 矩阵 | E | 工程 | `09` | 必做（超越 b） |
| Sentry 等第三方可观测 | — | 参考 | `08` | **参考**（不进必勾） |

## 冲突记录

| 冲突 | 裁决 |
|------|------|
| 标杆或旧稿把 Sentry 当世界级必达 | **以元指南为准：运维第三方不进必勾** |
| C 无 Swap 字面 | 共有「钱路径写」映射到产品主写路径（INPUTS 标注） |
