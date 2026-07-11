# 输入交接契约（Agent 开工前门闸）

未满足本节 → **禁止写业务页**。用户（或上游）必须提供下列输入；agent 用本节校验，缺则列出缺口并停止。

## 1. 设计稿

| 必给 | 格式 |
|------|------|
| 页面 frame 列表 | 每页：`产品面/状态`，例 `DApp/Swap/disconnected`、`DApp/Swap/connected`、`DApp/Swap/sessionReady` |
| 连接三态 | 未连接 / 已连接未登录 / 已登录（若产品无后端登录，注明「仅钱包态」） |
| PC 为文案 SSOT | H5 同文案；勿另给移动文案表 |
| 主 CTA 与钱路径入口 | 标注哪些按钮会发交易 / 授权 / 签名 |

Figma：提供 file 链接 + 每页 `node-id`。frame 标题即页面归属（例：Swap 页内说明仍属 Swap）。

## 2. 后端 API

| 必给 | 要求 |
|------|------|
| OpenAPI 3.x 或等价 | 至少含下方端点；完整业务 API 可增量 |
| 错误码表 | HTTP + 业务 code → 用户文案 key |
| 环境 Base URL | `staging` / `prod` 成对 |

**最小端点（无后端登录可整表标 N/A）：** 见 [templates/openapi-auth-claim.stub.yaml](./templates/openapi-auth-claim.stub.yaml)。

Claim 签名包必须能绑定：`address`、`amount`（或等价）、`deadline`/`nonce`、合约参数字段；`confirm` 必须幂等。

## 3. 链上合约

| 必给 | 格式 |
|------|------|
| chainId | 数字，与 RPC 一致 |
| 地址表 | 符合 [templates/addresses.schema.json](./templates/addresses.schema.json) |
| ABI 来源 | Foundry/Hardhat `out/` 路径，或 explorer 已验证地址，或 ABI JSON 文件 |
| 用户调用地址 | **仅代理/入口地址**；实现合约地址若提供只作只读标注 `implementationOnly: true`，**禁止**写入 |
| 代币表 | symbol、address、decimals、`approveResetToZero?: boolean` |
| 默认授权策略 | 勾选其一：`exact`（推荐）/ `infinite` / `Permit2`（仅合约已集成） |
| **写路径清单** | 对本产品实际使用的 path 逐项勾选：`swap` / `approve` / `presale` / `stake` / `reward_claim` / `other`。未用项写 `unused`。`presale`/`stake`/`other` 若勾选使用 → 须附步骤规格（或链到设计/合约调用说明）；勾 `unused` 则禁止实现该 path |

## 4. 运行密钥（可进 env，勿进 git）

```text
VITE_APP_ENV=staging|prod|development
VITE_API_BASE_URL=
VITE_WC_PROJECT_ID=
VITE_RPC_56=
VITE_SIWE_DOMAIN=         # 公开域名，如 app.example.com
VITE_SENTRY_DSN=          # 可选；第三方可观测不进必勾验收
```

地址表 JSON/TS 必须含字段 `env: development|staging|prod`（见 schema）。  
文件约定：`src/contracts/addresses/<env>/<chainId>.ts`（例 `staging/56.ts`）。  
启动：`VITE_APP_ENV === addresses.env`（`development` 可跳过）；且 API Base 与该 env 成对。禁止 staging 前端打 prod 合约。

## 5. Figma → 代码映射

| Frame 标题模式 | 代码落点 |
|----------------|----------|
| `DApp / Swap / *` | `src/features/swap/` |
| `DApp / Genesis|Presale|Stake / *` | `src/features/<name>/` |
| `DApp / Rewards / *` | `src/features/rewards/` |
| `Marketing / *` 或官网 | `src/marketing/`（禁 web3） |

状态后缀：`disconnected` | `connected` | `sessionReady`（或设计稿等价名）。缺态 → 记缺口。

## 6. Agent 收到输入后的动作

1. 对照本节打勾；输出「缺口列表」或「INPUTS OK」  
2. INPUTS OK → 按 [README 执行协议](./README.md) 建仓  
3. 默认栈：Vite + wagmi + RainbowKit（见 README）
