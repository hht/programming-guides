# commands

| 脚本 | 命令 | 何时 | 期望 |
|------|------|------|------|
| `dev` | `vite` | 本地 | — |
| `preview` | `vite preview` | e2e 前置 | 0 |
| `build` | `tsc -b && vite build` | CI/发版 | 0 |
| `typecheck` | `pnpm exec tsc -b --pretty false` | PR | 0 |
| `fmt` | `pnpm exec prettier --check .` | PR | 0 |
| `lint` | `pnpm exec eslint .` | PR | 0 |
| `test` | `vitest run` | PR | 0 |
| `test:e2e` | `playwright test` | 发版 | 0 |
| `check` | `pnpm typecheck && pnpm fmt && pnpm lint && pnpm test` | PR | 0 |
| `audit` | `pnpm audit` | 发版 | 0 或 exceptions 已记录 |

`fmt` / `lint` / `typecheck` 字符串与 [typescript Language Gate](../meta/language-gates/typescript.md) **逐字一致**。
