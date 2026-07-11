# 命令与退出码

| 命令 | 用途 | 成功退出码 |
|------|------|------------|
| `pnpm contracts:generate` | 生成 ABI / hooks | 0 |
| `pnpm fmt` | `pnpm exec prettier --check .` | 0 |
| `pnpm lint` | `pnpm exec eslint .` | 0 |
| `pnpm typecheck` | `pnpm exec tsc -b --pretty false` | 0 |
| `pnpm check` | generate + fmt + typecheck + lint + depcruise + unit | 0 |
| `pnpm test:unit` | 领域 / 写管道 / latch / slippage / claim | 0 |
| `pnpm test:e2e` | 钱路径契约（发版 / main） | 0 |
| `pnpm build` | 生产构建 | 0 |
| `pnpm audit` | 依赖审计（发版前） | 0 或已记录豁免 |

`fmt` / `lint` / `typecheck` 与 [typescript Language Gate](../meta/language-gates/typescript.md) **逐字一致**。  
`pnpm check` 非 0 → 禁止合入。e2e 不进 pre-commit；进 main/release CI。
