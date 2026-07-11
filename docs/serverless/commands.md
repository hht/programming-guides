# commands

| 脚本 | 命令 | 何时 | 期望 |
|------|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词（平台互斥、超时、触发表、幂等策略） | 本地/PR | exit 0 |
| `fmt` | `pnpm exec prettier --check .` | PR | exit 0 |
| `lint` | `pnpm exec eslint .` | PR | exit 0 |
| `typecheck` | `pnpm exec tsc -b --pretty false` | PR | exit 0 |
| `test` | 对照 `09` 单测适用行（Workers：vitest/pool 或平台推荐；其它平台等价） | PR | exit 0 |
| `test:e2e-invoke` | `09` 发版矩阵适用行（本地/预览 + staging HTTP） | 发版 | exit 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C） | PR | exit 0 |
| `check` | check-inputs + fmt + lint + typecheck + test + check-acceptance；发版加 test:e2e-invoke | PR/发版 | exit 0 |

`fmt` / `lint` / `typecheck` 与 [typescript Language Gate](../meta/language-gates/typescript.md) **逐字一致**。  
实现仓写入 `package.json`（见 [templates/package-scripts.snippet.json](./templates/package-scripts.snippet.json)）。
