# 05 — 钱路径（规格，非实现）

## 唯一写路径语义

```text
未 latch / 未 in-flight
  → 校验 wallet chainId 与 RPC chainId（缺一不可，禁止用 intent 自填）
  → simulateContract
  → writeContract(request)   // viem 官方配对
  → waitForTransactionReceipt
  → receipt.status === 'success' 才算成功（hash ≠ 成功）
  → 超时/未知 → 按 path latch，禁止立即重提
```

- **in-flight 键**：`account.toLowerCase() + ':' + path`（path ∈ `swap|approve|presale|stake|reward_claim|other`）  
- **latch 键**：同上；建议 `sessionStorage`，并尽量跨 tab 可感知（如 `localStorage` 锁）  
- **latch TTL**：无自动过期解锁；仅 fail-closed 人工流程可清（见下）

## 路径编排（步骤清单，代码自写）

**Approve（若需要）**  
读 allowance →（可选 approve 0）→ approve → wait → **再读** allowance ≥ 所需。

**Swap**  
- 默认 `slippageBps = 50`（0.50%）；UI 可改但须同一公式  
- `minOut = quotedOut * (10000 - slippageBps) / 10000`（bigint）  
- 报价门闸：非 placeholder、未过期（默认 maxAge **15s**，产品可改但须单一常量）  
- 点击后 **live 二次报价** + 余额 → approve 流 → 写入 `minOut` → 写路径  

**Claim（若有后端签名）**  
取签名包（绑定 address/amount/deadline/nonce）→ 写路径 → `confirm(txHash)`；`confirm_failed` **保留 txHash、禁止再发 claim tx**（仅可重试 confirm API）。

## Unknown 恢复策略（钉死）

- 默认 **fail-closed**，禁止一键解锁  
- 若提供解锁：用户须确认浏览器中无成功交易后再清 latch  

## 错误

拒签静默；simulate custom error → i18n key；禁止 raw hex 给用户。

## 单测应覆盖（在目标仓写）

intent 链/账户变化、报价过期/placeholder、latch/inflight、confirm_failed 不重发、RPC chain 不符、登录失败分类。
