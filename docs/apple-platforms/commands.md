# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词（含矩阵非空、平台勾选） | exit 0 |
| `test` | `xcodebuild test`（或等价）对照 `09` 单测 | exit 0 |
| `test:e2e-apple` | `09` 发版矩阵适用行（模拟器 / Mac） | exit 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C） | exit 0 |
| `check` | check-inputs + test + check-acceptance；发版加 test:e2e-apple | exit 0 |

实现仓将上表写入 Makefile / 脚本；示例键名见 [templates/xcode-scripts.snippet.md](./templates/xcode-scripts.snippet.md)。本指南不附可运行业务测试代码。
