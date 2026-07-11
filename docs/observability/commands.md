# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词（含信号裁剪） | exit 0 |
| `test` | 对照 `09` 单测适用行（可用 in-memory exporter / log capture） | exit 0 |
| `test:e2e-telemetry` | `09` 发版矩阵适用行（含「凭 id 追查」） | exit 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C；B 禁 SaaS 安装句） | exit 0 |
| `check` | check-inputs + test + check-acceptance；发版加 test:e2e-telemetry | exit 0 |

实现仓将上表脚本名写入 package.json / Makefile / go test 入口；本指南不附可运行业务测试代码。  
**禁止**把「Sentry DSN 可达」写成 `check` 必绿条件。
