# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层 → [typescript Language Gate](../meta/language-gates/typescript.md)。  
> SPA 工程习惯链 [react/00](../react/00-principles.md)；**本册 SSOT** 是链上钱路径不变量。

## 决策优先级

**正确性 > 可验证性 > 简洁性 > 复用 > 速度**

Web3 前端正确性特指：用户资产安全；状态诚实；ABI/地址/chainId 单 owner。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 需要后端身份时：SIWE（或等价）换会话；业务 API 用 `sessionReady` | `07` / e2e |
| F02 | MUST NOT | 用 `isConnected` 驱动业务 API | 同上 |
| F03 | MUST | 合约调用只走 typed 边界（地址表 + 生成 ABI + 薄封装） | codegen / 抽检 |
| F04 | MUST NOT | 页面内拼 `address` + 手写 ABI 片段 | 架构 lint |
| F05 | MUST | 写链 Simulate → Write → Wait；模拟失败不弹钱包 | `05` / e2e |
| F06 | MUST | hash 仅表示已提交；回执确认后才改乐观 UI / 清 latch | `05` |
| F07 | MUST | 金额用 `bigint`（链上单位）；展示层才 format | 单测 |
| F08 | MUST NOT | 用 `number` 做 wei/金额运算 | 同上 |
| F09 | MUST | pending 超时无回执 → latch；默认 fail-closed | `05` |
| F10 | MUST NOT | 未知结果立即重提 / 一键解锁 | 同上 |
| F11 | MUST NOT | 营销面加载钱包 SDK（`viem`/`wagmi`/`thirdweb`） | depcruise / lint |
| F12 | MUST | 链/地址/ABI/env/会话/query-key 单 owner（见 SSOT 表） | 目录抽检 |

## SSOT 清单

| 真相 | Owner（示例路径） | 禁止 |
|------|-------------------|------|
| 链定义 / RPC | `src/chain/chains.ts` | 组件内写 chainId |
| 合约地址 | `src/contracts/addresses/` | JSX 硬编码地址 |
| ABI | `src/contracts/generated/`（生成） | 手改生成文件 |
| 环境变量语义 | `src/config/env.ts` | 散落 `import.meta.env` |
| 会话 | `auth` store + provider | localStorage 直接当登录 |
| Query key | `src/api/query-keys.ts` | 字符串魔法散落 |
| 文案 | `i18n/messages/` | 组件内硬编码用户可见文案（除调试） |

## 成功标准（超越）

- [ ] **超越 a**：`05` / `11` 两条对照句不变量已落地  
- [ ] **超越 b**：发版钱路径 e2e（`09`）exit 0  
- [ ] 合约层 codegen + 地址表；钱路径单测；有后端则 SIWE 服务端校验；CI `check`  

**MUST NOT** 把 Sentry/第三方可观测当作超越或必勾。

## 反模式速查

| 反模式 | 后果 | 正确做法 |
|--------|------|----------|
| `ethers` + 无类型 ABI | 运行时才发现参数错 | viem + `as const` / wagmi generate |
| approve 无限额无说明 | 用户被钓鱼式授权 | 明确额度策略 + UI 风险提示 |
| 报价一次后直接 swap | 滑点/余额变化导致 revert | submit 前 live 二次门闸 |
| 401 只 toast | 用户以为还登录着 | `invalidateSession` + 引导重签 |
| 把 `core` 写成 React hooks | 无法单测、循环依赖 | 纯函数在 `domain/`，hooks 在 `features/` |
