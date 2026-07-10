# commands — 门禁

在**目标新仓库**执行（非本指南仓）。

| 脚本名 | 命令 | 何时 | 期望 |
|--------|------|------|------|
| `build` | `tsc`（或 `pnpm build`） | 本地 / CI | exit 0 |
| `typecheck` | `tsc --noEmit` | PR | exit 0 |
| `lint` | `eslint .` | PR | exit 0 |
| `test` | `vitest run` | PR | exit 0 |
| `test:e2e` | `vitest run --config vitest.e2e.config.ts`（spawn `build/cli.js`，见 `09`） | 发版 | exit 0 |
| `check` | `pnpm typecheck && pnpm lint && pnpm test` | PR 必跑 | exit 0 |

`templates/package-scripts.snippet.json` 仅提供 scripts **键名与命令字符串**示例，实现时按栈微调 flag，勿改键名语义。
