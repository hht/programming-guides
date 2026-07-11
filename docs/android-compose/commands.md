# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词（含 UI 状态矩阵已填） | exit 0 |
| `test` | 对照 `09` 单测（含 Turbine / reduce） | exit 0 |
| `test:ui` | Compose UI Test（INPUTS §11 设备） | exit 0 |
| `test:e2e-android` | `09` 发版矩阵 1–5 + 7（+6 若鉴权） | exit 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C） | exit 0 |
| `check` | check-inputs + test + check-acceptance；发版加 test:ui + test:e2e-android | exit 0 |

实现仓将上表写入 Gradle task / Makefile / scripts；示例键名见 [templates/gradle-tasks.snippet.md](./templates/gradle-tasks.snippet.md)。本指南不附可运行业务测试代码。
