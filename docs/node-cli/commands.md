# commands — 门禁

在**目标新仓库**执行（非本指南仓）。

| 脚本名 | 命令 | 何时 | 期望 |
|--------|------|------|------|
| `build` | `tsc`（或 `pnpm build`） | 本地 / CI | exit 0 |
| `fmt` | `pnpm exec prettier --check .` | PR | exit 0 |
| `typecheck` | `pnpm exec tsc -b --pretty false` | PR | exit 0 |
| `lint` | `pnpm exec eslint .` | PR | exit 0 |
| `test` | `vitest run` | PR | exit 0 |
| `test:e2e` | `vitest run --config vitest.e2e.config.ts`（spawn `build/cli.js`，见 `09`） | 发版 | exit 0 |
| `check` | `pnpm typecheck && pnpm fmt && pnpm lint && pnpm test` | PR 必跑 | exit 0 |

`fmt` / `lint` / `typecheck` 与 [typescript Language Gate](../meta/language-gates/typescript.md) **逐字一致**。  
`templates/package-scripts.snippet.json` 仅提供 scripts 键名与命令字符串示例。
