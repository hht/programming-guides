# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词（含 OS / command 表 / capability 表 / allowlist） | exit 0 |
| `test` | 对照 `09` 单测适用行（含 Lifecycle、allowlist 集合、capability 拒绝） | exit 0 |
| `test:e2e-desktop` | `09` 发版矩阵适用 OS 行 | exit 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C） | exit 0 |
| `check` | check-inputs + test + check-acceptance；发版加 test:e2e-desktop | exit 0 |

实现仓将上表脚本名写入 package.json / just / Makefile；本指南不附可运行业务测试代码。

建议前端 scripts 键名见 [templates/package-scripts.snippet.json](./templates/package-scripts.snippet.json)。
