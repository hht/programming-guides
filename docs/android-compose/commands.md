# commands

| 脚本 | 命令 | 何时 | 期望 |
|------|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词（含 UI 状态矩阵已填） | 本地/PR | exit 0 |
| `fmt` | `./gradlew ktlintCheck` | PR | exit 0 |
| `lint` | `./gradlew detekt` | PR | exit 0 |
| `test` | 对照 `09` 单测（含 Turbine / reduce） | PR | exit 0 |
| `test:ui` | Compose UI Test（INPUTS §11 设备） | PR | exit 0 |
| `test:e2e-android` | `09` 发版矩阵 1–5 + 7（+6 若鉴权） | 发版 | exit 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C） | PR | exit 0 |
| `check` | check-inputs + fmt + lint + test + check-acceptance；发版加 test:ui + test:e2e-android | PR/发版 | exit 0 |

`fmt` / `lint` 与 [kotlin Language Gate](../meta/language-gates/kotlin.md) **逐字一致**。  
实现仓写入 Gradle task / Makefile；示例见 [templates/gradle-tasks.snippet.md](./templates/gradle-tasks.snippet.md)。
