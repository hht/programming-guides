# 00 — 原则与不变量

## 决策优先级

**正确性 > 可验证性 > 简洁性 > 复用 > 速度**

Web3 前端的「正确性」特指：

1. **用户资产安全**：错误金额、错误链、错误合约、重复提交、盲签。
2. **状态诚实**：pending ≠ success；hash ≠ 上链成功；连接 ≠ 登录。
3. **类型与边界**：ABI/地址/chainId 只有一个 owner。

## 六条硬不变量

1. **连接钱包 ≠ 业务登录**  
   需要后端身份时，必须 SIWE（或等价）换会话；UI 用 `sessionReady`，不用 `isConnected` 驱动业务 API。

2. **合约调用只走 typed 边界**  
   禁止在页面里拼 `address` + 手写 ABI 片段。地址表 + 生成 ABI + 薄封装。

3. **写链必须 Simulate → Write → Wait**  
   模拟失败不弹钱包；hash 只表示「已提交」；回执确认后才改乐观 UI / 清 latch。

4. **金额一律 `bigint`（链上单位）**  
   展示层才 format；禁止用 `number` 做 wei/金额运算。

5. **未知交易结果禁止立即重提**  
   pending 超时无回执 → latch；默认 fail-closed，禁止一键解锁（见 05）。

6. **营销面不加载钱包 SDK**  
   官网/Landing 与 DApp 分入口或分 chunk；Home 禁 `viem`/`wagmi`/`thirdweb`（用架构 lint 强制）。

## SSOT 清单（每个项目开工时填表）

| 真相 | Owner（示例路径） | 禁止 |
|------|-------------------|------|
| 链定义 / RPC | `src/chain/chains.ts` | 组件内写 chainId |
| 合约地址 | `src/contracts/addresses/` | JSX 硬编码地址 |
| ABI | `src/contracts/generated/`（生成） | 手改生成文件 |
| 环境变量语义 | `src/config/env.ts` | 散落 `import.meta.env` |
| 会话 | `auth` store + provider | localStorage 直接当登录 |
| Query key | `src/api/query-keys.ts` | 字符串魔法散落 |
| 文案 | `i18n/messages/` | 组件内硬编码用户可见文案（除调试） |

## 成功标准（新项目「超越」的定义）

相对「能连上钱包、能点 Swap」的 demo，本指南要求至少：

- [ ] 合约层 **codegen + 地址表**，页面零裸 ABI
- [ ] 钱路径单测覆盖：链错误、用户拒签、模拟失败、unknown latch
- [ ] SIWE 服务端校验 nonce/domain（若有后端）
- [ ] CI：`tsc` + lint + 架构边界 + 钱路径单测
- [ ] 发版：钱路径 e2e exit 0（书面冒烟不可替代，除非 INPUTS 书面豁免）
- [ ] 错误监控（Sentry 等）接上链上/会话失败

## 反模式速查

| 反模式 | 后果 | 正确做法 |
|--------|------|----------|
| `ethers` + 无类型 ABI | 运行时才发现参数错 | viem + `as const` / wagmi generate |
| approve 无限额无说明 | 用户被钓鱼式授权 | 明确额度策略 + UI 风险提示 |
| 报价一次后直接 swap | 滑点/余额变化导致 revert | submit 前 live 二次门闸 |
| 401 只 toast | 用户以为还登录着 | `invalidateSession` + 引导重签 |
| 把 `core` 写成 React hooks | 无法单测、循环依赖 | 纯函数在 `domain/`，hooks 在 `features/` |
