# 09 — 测试与 CI（规格）

在**目标仓库**建立测试；本指南不附测试源码。

## 单测落点

`tests/unit/*.test.ts`（与 TS 栈一致；**全仓统一**；禁止再开 `*.mjs` 平行套）。

## 单测 case → 期望（最少集）

| case | 期望 |
|------|------|
| write intent 缺 chainId / 账户变 | 抛错，不发 tx |
| RPC chainId ≠ intent | 抛错 |
| 报价 placeholder / 过期 | `canSubmit` 失败 |
| `minOut` bps=50 | `10000 → 9950` |
| 同 path inflight / latch | 第二次提交失败 |
| claim `confirm_failed` | 不重发 claim tx |
| SIWE `user_rejected` | 无错误 toast |
| SIWE `banned` | 专用文案 |

## 发版 e2e 场景 × 断言（钱路径契约）

| 场景 | 断言 |
|------|------|
| 无有效报价 | 主 CTA disabled |
| connected 无 session（若需登录） | 可见 Sign in，不可打私有 API 成功态 |
| 错链 | 写 CTA 不可用或引导 switchChain |
| 用户拒签（mock） | 无错误 toast；回 idle |
| 模拟失败（mock） | 不进入 success |
| 回执成功（mock） | 才出现 success；仅有 hash 不足 |
| latch 已置位 | 同 path 不可再提交 / 显示 latched 文案 |
| claim confirm_failed（若有） | 保留 tx 提示；不二次发 claim tx |

禁止用 `test.skip` 冒充绿；缺 fixture 则 e2e 失败。

## CI

| 何时 | 命令 | 成功 |
|------|------|------|
| 每个 PR | `pnpm check` | exit 0 |
| main/release | `pnpm test:e2e`；`pnpm audit`（exit 0 **或** 仓内 `docs/audit-exceptions.md` 已记录 CVE+理由+到期日） | 见左 |

见 [commands.md](./commands.md)。**发版必须 e2e=0**（与 [11](./11-world-class-acceptance.md) 一致；书面冒烟不可替代 e2e，除非 INPUTS 书面豁免并记录风险）。
