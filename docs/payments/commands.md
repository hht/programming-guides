# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词（支付商互斥、Money、webhook secret、事件名表） | exit 0 |
| `test` | 对照 `09` 单测适用行（含验签向量 / 状态转移纯函数） | exit 0 |
| `test:e2e-payments` | `09` 发版矩阵适用行（test mode 提供商或契约 fake） | exit 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C） | exit 0 |
| `check` | check-inputs + test + check-acceptance；发版加 test:e2e-payments | exit 0 |

实现仓将上表脚本名写入 package.json / Makefile / go test 入口；本指南不附可运行业务测试代码。
