# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词（含妥协层选型、UI 矩阵、§9、§10） | exit 0 |
| `test` | 对照 `09` 单测（含 Lifecycle / blur 取消） | exit 0 |
| `test:ui` | RNTL（INPUTS §13 设备/环境） | exit 0 |
| `test:e2e-expo` | `09` 发版矩阵 1–5 + 7（+6/8 若适用） | exit 0 |
| `doctor` | `npx expo-doctor`（策略见 `09`） | exit 0（或实现仓写明的 warn 策略） |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C） | exit 0 |
| `check` | check-inputs + test + check-acceptance；发版加 test:ui + test:e2e-expo + doctor | exit 0 |

实现仓将上表写入 `package.json` scripts；示例见 [templates/package-scripts.snippet.json](./templates/package-scripts.snippet.json)。本指南不附可运行业务测试代码。
