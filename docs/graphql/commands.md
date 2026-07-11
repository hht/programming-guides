# commands

| 脚本 | 命令 | 何时 | 期望 |
|------|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词 | 本地/PR | exit 0 |
| `fmt` | `pnpm exec prettier --check .` | PR | exit 0 |
| `lint` | `pnpm exec eslint .` | PR | exit 0 |
| `typecheck` | `pnpm exec tsc -b --pretty false` | PR | exit 0 |
| `lint:graphql` | `graphql-eslint`（schema + operations） | PR | exit 0 |
| `codegen` | graphql-codegen；生成物与 SDL 一致 | PR | exit 0 |
| `test` | 对照 `09` 单测 | PR | exit 0 |
| `test:e2e-graphql` | `09` 发版矩阵 1–7 | 发版 | exit 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C） | PR | exit 0 |
| `check` | check-inputs + fmt + lint + typecheck + lint:graphql + codegen + test + check-acceptance；发版加 test:e2e-graphql | PR/发版 | exit 0 |

`fmt` / `lint` / `typecheck` 与 [typescript Language Gate](../meta/language-gates/typescript.md) **逐字一致**。
