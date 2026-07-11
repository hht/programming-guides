# 04 — 钱包与 SIWE（规格）

## 状态（必须可表达）

| 名 | 含义 |
|----|------|
| `walletReady` | 已连接且有 address |
| `sessionReady` | 当前地址会话有效 |
| `needsSignIn` | 已连接无会话 |
| `writeReady` | walletReady 且 chainId 正确 |

禁止用 `isConnected` 打私有 API。

## 连接

默认 RainbowKit + wagmi：injected（EIP-6963）+ WalletConnect。错链引导 `switchChain`。

## 会话默认（Vite SPA）

- Bearer JWT；按 **地址小写分桶** 存（如 sessionStorage） 
- 请求头 `Authorization: Bearer` 
- 切账户 / 401 → 清当前桶并 `needsSignIn` 
- 全仓一种方案；Next+Cookie 仅当 INPUTS 写明要求时改用 

## SIWE（服务端 P0）

已知 domain、服务端单次 nonce、expiration 5–15min、校验 chainId；建议 strict（uri+chainId）；HTTPS；限流；合约钱包配 EIP-1271。

客户端：按 EIP-4361 组装（或服务端下发）message 再签名；登录文案 ≠ 交易/授权签名。

## 登录失败分类（单测/UI 必用）

| kind | 含义 | UI |
|------|------|-----|
| `banned` | 地址被禁 | 专用文案，不引导狂点重试 |
| `user_rejected` | 用户拒签 | 静默 |
| `signature_rejected` | 服务端拒签/nonce/domain | 提示重试登录 |
| `transient` | 网络/5xx | 可重试 |
| `failed` | 其它 | 通用失败 |

## Agent 自行实现

Connect 壳、Auth 上下文、SIWE 编排、session 读写——按本规格在目标仓编写。
