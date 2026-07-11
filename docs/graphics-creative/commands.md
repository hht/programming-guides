# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词（含平台裁剪） | exit 0 |
| `check-motion-registry` | 校验 frame-budgets / registry 对齐 [templates/frame-budget.schema.json](./templates/frame-budget.schema.json)；关键行含预算数字 | exit 0 |
| `check-whitelist` | 对关键动效样式/声明 rg：禁 `top:`/`left:`/`width:`/`height:` 等作 animation/transition 属性（实现仓可调路径） | exit 0 |
| `test` | 对照 `09` 单测（状态机/schema） | exit 0 |
| `test:e2e-motion` | `09` 发版矩阵按平台适用行（含测量清单勾选） | exit 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C） | exit 0 |
| `check` | check-inputs + check-motion-registry + check-whitelist + test + check-acceptance；发版加 test:e2e-motion | exit 0 |

实现仓将上表脚本名写入 package.json / Makefile；本指南不附可运行业务动效代码。
