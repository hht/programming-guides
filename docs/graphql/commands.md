# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词 | exit 0 |
| `lint:graphql` | `graphql-eslint`（schema + operations） | exit 0 |
| `codegen` | graphql-codegen；生成物与 SDL 一致 | exit 0 |
| `test` | 对照 `09` 单测 | exit 0 |
| `test:e2e-graphql` | `09` 发版矩阵 1–7 | exit 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C） | exit 0 |
| `check` | check-inputs + lint:graphql + codegen + test + check-acceptance；发版加 test:e2e-graphql | exit 0 |

实现仓将上表脚本名写入 package.json / Makefile；本指南不附可运行业务测试代码。
