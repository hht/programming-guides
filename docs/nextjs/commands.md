# commands

| 脚本 | 命令 | 何时 | 期望 |
|------|------|------|------|
| `check-inputs` | 校验 INPUTS 必填谓词 | 本地/PR | OK |
| `fmt` | `pnpm exec prettier --check .` | PR | 0 |
| `lint` | `pnpm exec eslint .` | PR | 0 |
| `typecheck` | `pnpm exec tsc -b --pretty false` | PR | 0 |
| `test` | `vitest run` | PR | 0 |
| `build` | `next build` | PR/发版 | 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C；C 仅维护者） | PR | OK |
| `check` | check-inputs + fmt + lint + typecheck + test + build + check-acceptance | PR | 0 |
| `e2e` | playwright：`09` 矩阵 1–4 中非 N/A 项（§5=无则跳过 #4） | 发版 | 0 |
| `check-release` | check + e2e | 发版 | 0 |
| `check-guide` | `11` **C** 节（维护者） | 维护 | OK |

`fmt` / `lint` / `typecheck` 与 [typescript Language Gate](../meta/language-gates/typescript.md) **逐字一致**。
