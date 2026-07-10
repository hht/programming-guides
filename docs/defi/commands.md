# 命令与退出码

| 命令 | 用途 | 成功退出码 |
|------|------|------------|
| `pnpm contracts:generate` | 生成 ABI / hooks | 0 |
| `pnpm check` | generate + tsc + eslint + depcruise + unit | 0 |
| `pnpm test:unit` | 领域 / 写管道 / latch / slippage / claim | 0 |
| `pnpm test:e2e` | 钱路径契约（发版 / main） | 0 |
| `pnpm build` | 生产构建 | 0 |
| `pnpm audit` | 依赖审计（发版前） | 0 或已记录豁免 |

`pnpm check` 非 0 → 禁止合入。e2e 不进 pre-commit；进 main/release CI。
