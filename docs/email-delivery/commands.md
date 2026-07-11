# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词（供应商互斥、模板清单、幂等、路径、Webhook） | exit 0 |
| `test` | 对照 `09` 单测适用行（provider stub；异步则 testcontainer/Compose） | exit 0 |
| `test:e2e-email` | `09` 发版矩阵适用行 | exit 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C） | exit 0 |
| `check` | check-inputs + test + check-acceptance；发版加 test:e2e-email | exit 0 |

实现仓将上表脚本名写入 package.json / Makefile / go test 入口；本指南不附可运行业务测试代码。
