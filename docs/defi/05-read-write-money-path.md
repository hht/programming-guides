# 05 — 钱路径（规格，非实现）

## 唯一写路径语义

```text
未 latch / 未 in-flight（对本 path 键）
 → 校验 wallet chainId 与 RPC chainId（缺一不可，禁止用 intent 自填）
 → 置 in-flight
 → simulateContract
 →（simulate 失败 → 清 in-flight → 停，不弹钱包）
 → writeContract(request) // viem 官方配对
 →（用户拒签 → 清 in-flight → 静默回 idle）
 → waitForTransactionReceipt（默认 timeoutMs = 180_000）
 → receipt.status === 'success' → 清 in-flight（及同键 latch 若有）→ 成功
 → receipt 失败/revert → 清 in-flight → error
 → 超时/无最终回执 → 清 in-flight → 置 latch → 禁止立即重提
```

## 键与生命周期

| 项 | 规则 |
|----|------|
| 键 | `account.toLowerCase() + ':' + path` |
| path 枚举 | `swap` \| `approve` \| `presale` \| `stake` \| `reward_claim` \| `other` |
| 存储 | in-flight：内存（可加 broadcast）；latch：`sessionStorage` 必做，建议同步 `localStorage` 跨 tab |
| latch TTL | **无**自动过期；仅 fail-closed 人工清 |

### Swap 内嵌 Approve 的 path 归属

- 授权交易只用 path=`approve`（置/清 in-flight 与 latch） 
- Swap 交易只用 path=`swap` 
- **禁止**用 `swap` 键锁住 approve 交易，或反过来 
- `canSubmit(swap)`：账户下 `approve` **或** `swap` 任一 in-flight/latched → **不可**提交 swap（避免并行钱路径）

## 报价对象与 canSubmit（类型级）

```text
Quote = {
 amountIn: bigint
 amountOut: bigint // 原始报价出量
 fetchedAt: number // Date.now() ms
 isPlaceholder: boolean // true=骨架/估数，不可提交
}

QUOTE_MAX_AGE_MS = 15_000 // 单一常量；产品可改但全仓一处

minOut(amountOut, slippageBps) =
 (amountOut * (10000n - BigInt(slippageBps))) / 10000n
 // bigint 整除=向 0 截断；即 floor（金额≥0 时）

canSubmit(quote, balancesOk, keysClear) =
 !quote.isPlaceholder
 && (now - quote.fetchedAt) <= QUOTE_MAX_AGE_MS
 && balancesOk
 && keysClear // 无相关 in-flight/latch
 && walletReady &&（若需）sessionReady
```

默认 `slippageBps = 50`。

## 路径编排

**Approve** 
读 allowance →（若 `approveResetToZero`：对 path=`approve` **完整**走一遍写路径 approve(0)→wait 成功）→ 再对 path=`approve` **完整**走 approve(额度)→wait → **再读** allowance ≥ 所需 → 清 in-flight。 
（两笔均为独立 simulate→write→wait；中间失败按写路径清 in-flight / 置 latch。）

**Swap** 
1. UI：`canSubmit` 为真才启用主 CTA 
2. 点击 → **live 二次报价**（新 `fetchedAt`） 
3. 若二次报价 `isPlaceholder`、过期、或 `amountOut` **低于**点击前报价的 `minOut` 所用出量（恶化）→ 中止，提示刷新，**不**开写 
4. 余额不足 → 中止 
5. 若 allowance 不足 → 跑 Approve 流（path=`approve`）→ 成功后 **必须再跑一次 live 报价** 并重算 `canSubmit`（含 `QUOTE_MAX_AGE_MS`）；失败则中止，**禁止**沿用 approve 前的旧报价直接 swap 
6. 用**最新**报价算 `minOut` → 写路径 path=`swap`

**`balancesOk`**：用户输入 `amountIn` ≤ 该代币钱包余额（bigint）；原生币须预留 gas 则产品在 INPUTS 约定保留量，默认保留 `0n`（仅 ERC20 精确比较）。 
**`walletReady`**：已连接且 `wallet.chainId ===` 配置 chainId（与 RPC 校验分工：UI 门闸用钱包；写前再读 RPC）。

**其它 path**（`presale`/`stake`/`other`）：须在 INPUTS 附步骤规格，或声明「本产品不用」；**禁止**无规格自造写路径。

**Claim（若有后端签名）** 
取签名包 → 写路径 path=`reward_claim` → `confirm(txHash)`；`confirm_failed` **保留 txHash、禁止再发 claim tx**（仅可重试 confirm API）。

## Unknown 恢复

- 默认 **fail-closed**，禁止一键解锁 
- 若提供解锁：用户须确认浏览器中无成功交易后再清 **该键** latch 

## 错误

拒签静默；simulate custom error → i18n key；禁止 raw hex 给用户。

## 单测探针（目标仓）

| case | 期望 |
|------|------|
| simulate 失败 | 未 write；in-flight 已清 |
| 拒签 | in-flight 已清；无错误 toast |
| 成功回执 | in-flight 清；无 latch |
| wait 超时 | latch 置位；同 path 不可再提交 |
| swap 时 approve latched | canSubmit false |
| placeholder / 过期报价 | canSubmit false |
| minOut bps=50 | `10000n → 9950n` |
| 二次报价恶化 | 不发 tx |
| confirm_failed | 不重发 claim tx |
