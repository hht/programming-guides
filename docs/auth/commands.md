# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词（含模式裁剪） | exit 0 |
| `test` | 对照 `09` 单测（含 idle 续期适用行） | exit 0 |
| `test:e2e-auth` | `09` 发版矩阵按模式适用行 | exit 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C） | exit 0 |
| `check` | check-inputs + test + check-acceptance；发版加 test:e2e-auth | exit 0 |

实现仓将上表脚本名写入 package.json / Makefile；本指南不附可运行业务测试代码。
