# commands

| 脚本 | 命令 | 何时 | 期望 |
|------|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词（含妥协层选型、UI 矩阵、§9、§10） | 本地/PR | exit 0 |
| `fmt` | `pnpm exec prettier --check .` | PR | exit 0 |
| `lint` | `pnpm exec eslint .` | PR | exit 0 |
| `typecheck` | `pnpm exec tsc -b --pretty false` | PR | exit 0 |
| `test` | 对照 `09` 单测（含 Lifecycle / blur 取消） | PR | exit 0 |
| `test:ui` | RNTL（INPUTS §13 设备/环境） | PR | exit 0 |
| `test:e2e-expo` | `09` 发版矩阵 1–5 + 7（+6/8 若适用） | 发版 | exit 0 |
| `doctor` | `npx expo-doctor`（策略见 `09`） | 发版 | exit 0（或实现仓写明的 warn 策略） |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C） | PR | exit 0 |
| `check` | check-inputs + fmt + lint + typecheck + test + check-acceptance；发版加 test:ui + test:e2e-expo + doctor | PR/发版 | exit 0 |

`fmt` / `lint` / `typecheck` 与 [typescript Language Gate](../meta/language-gates/typescript.md) **逐字一致**。  
实现仓写入 `package.json` scripts；示例见 [templates/package-scripts.snippet.json](./templates/package-scripts.snippet.json)。
