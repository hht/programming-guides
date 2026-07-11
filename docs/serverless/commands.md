# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词（平台互斥、超时、触发表、幂等策略） | exit 0 |
| `test` | 对照 `09` 单测适用行（Workers：vitest/pool 或平台推荐；其它平台等价） | exit 0 |
| `test:e2e-invoke` | `09` 发版矩阵适用行（本地/预览 + staging HTTP） | exit 0 |
| `typecheck` | `tsc --noEmit`（或平台等价） | exit 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C） | exit 0 |
| `check` | check-inputs + typecheck + test + check-acceptance；发版加 test:e2e-invoke | exit 0 |

实现仓将上表脚本名写入 `package.json`（见 [templates/package-scripts.snippet.json](./templates/package-scripts.snippet.json)）；本指南不附可运行业务测试代码。
