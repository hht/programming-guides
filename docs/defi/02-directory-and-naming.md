# 02 — 目录组织与命名

> 本节刻意纠正「`components/` / `hooks/` / `utils/` 大口袋 + ABI 随处粘贴」的常见布局。  
> 命名以 **业务能力** 与 **边界** 为准，不以文件类型堆文件夹。

## 推荐树（Vite CSR DApp）

```text
src/
  app/                     # 入口、providers、路由壳、全局 error boundary
    bootstrap/
    routes/
  chain/                   # 链定义、transport、切链、explorer URL
    chains.ts
    transports.ts
    wagmi-config.ts
  contracts/               # ★ 链上合约 SSOT（见 03）
    addresses/
      staging/
        56.ts              # 必含 schema 字段 env:'staging'
      prod/
        56.ts
      index.ts             # 按 VITE_APP_ENV 选择表 + getWritableAddress
    abis/                  # 手写最小 ABI 仅作过渡；优先 generated
    generated/             # @wagmi/cli 输出（禁手改）
    readers/               # 纯 async 读（可选，无 React）
    writers/               # 纯 async 写 intent 构建（可选）
    tokens.ts              # 常用 ERC20 元数据（decimals/symbol 缓存策略）
  domain/                  # 纯业务规则：无 React、无 wagmi、无 fetch
    swap/
    auth/
    rewards/
  features/                # 有 UI 的功能切片（可含 use-*）
    swap/
    genesis/
    rewards/
    community/
  widgets/                 # 跨 feature 的大块 UI（连接按钮、壳、表）
  ui/                      # 哑组件：Button、Text、Dialog（无业务、无链）
  api/                     # HTTP 客户端、session request、query keys
  auth/                    # SIWE 客户端编排 + session store（无合约 ABI）
  i18n/
  config/                  # env、feature flags、非链配置
  styles/
  marketing/               # 官网；禁止 import chain/contracts/wagmi
```

### 为什么这样拆

| 目录 | 解决什么问题 |
|------|----------------|
| `contracts/` | 合约不再散落 `web3/abis.ts` + 页面内地址 |
| `chain/` | 链/RPC/wagmi config 与「某个业务合约」解耦 |
| `domain/` | 报价校验、门闸、金额规则可单测 |
| `features/` | 按产品面切片，避免 `views/dapp/swap/...` 与 `hooks/` 双口袋 |
| `marketing/` | 强制包体隔离 |

## 命名规则

### 文件

| 类型 | 模式 | 例 |
|------|------|-----|
| 纯函数模块 | `kebab-case.ts` | `can-submit-quoted-swap.ts` |
| React 组件 | `kebab-case.tsx` | `swap-review-panel.tsx` |
| Hook | `use-*.ts` | `use-swap-quote.ts` |
| 生成物 | `generated/*.ts` | `generated/swap-router.ts` |
| 地址表 | `<chainId>.ts` 或 `<network>.ts` | `56.ts` / `bsc.ts`（二选一，全仓统一） |
| 测试 | 与模块同域 | `can-submit-quoted-swap.test.ts` |

### 符号

| 概念 | 推荐名 | 避免 |
|------|--------|------|
| 钱包已连接且可签名 | `walletReady` | `isAuthenticated` |
| SIWE 会话有效 | `sessionReady` | 用 `isConnected` 代替 |
| 需要签名登录 | `needsSignIn` | — |
| 写链就绪（连上 + 正确链） | `writeReady` | — |
| 业务 Tab | 产品名：`swap` / `stake` | 合约名当 Tab |
| 合约域 | 与 Solidity 名对齐：`PreSale` | 强行改成产品名导致搜不到 |

> **产品名 vs 合约名**：UI 用 Genesis，链上模块可叫 `presale`——在词表里写清映射，不要整库改名把 ABI 对不上。

## 依赖方向（建议用 dependency-cruiser 固化）

```text
marketing  ↛  chain | contracts | features(dapp) | wagmi | viem
ui         ↛  domain | features | contracts | api
domain     ↛  react | wagmi | viem | features | api
contracts/readers|writers  →  viem, contracts/generated, chain
features   →  domain, contracts, api, ui, auth
auth       →  api, domain/auth（可）; ↛ features
app        →  组装以上
```

## 反例 → 正例

```text
❌ src/components/Swap.tsx 里 import abiJson + 硬编码 0x...
✅ features/swap/swap-form.tsx → useSwapQuote → domain/swap/* → contracts/generated

❌ src/utils/helpers.ts 一千行
✅ domain/swap/format-amount.ts、domain/auth/classify-login-failure.ts

❌ src/hooks/useContract.ts 万能 hook
✅ contracts 层具体函数 + features 内薄 hook
```

## Ubiquitous Language

新项目第 0 周建 `UBIQUITOUS_LANGUAGE.md`：

- 登录态、领取、授权、报价、确认失败等 **业务词 = 代码名**
- 冻结：合约字段名、React Query key、错误哨兵字面量（如 `confirm_failed`）

无词表就开写 → 两周后必出现 `isAuth` / `isLogin` / `connected` 三套同义词。
