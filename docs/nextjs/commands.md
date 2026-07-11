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
| `secrets-scan` | 扫 `.env*` / `env.example` / CI 注入：`NEXT_PUBLIC_*` 名或值不得含 `SECRET`/`PASSWORD`/`PRIVATE_KEY`/`API_KEY` 等密钥语义（实现仓脚本；命中 → exit 1） | PR | 0 |
| `check` | check-inputs + fmt + lint + typecheck + test + build + secrets-scan + check-acceptance | PR | 0 |
| `e2e` | playwright：`09` 矩阵 1–4 中非 N/A 项（§5=无则跳过 #4） | 发版 | 0 |
| `check-release` | check + e2e | 发版 | 0 |
| `check-guide` | `11` **C** 节（维护者） | 维护 | OK |

`fmt` / `lint` / `typecheck` 与 [typescript Language Gate](../meta/language-gates/typescript.md) **逐字一致**。
