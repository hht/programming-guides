# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | INPUTS 谓词 | OK |
| `lint` | eslint + tsc | 0 |
| `test` | vitest | 0 |
| `build` | next build | 0 |
| `check-acceptance` | 11 勾选 | OK |
| `check` | 上列全部 | 0 |
| `e2e` | playwright 矩阵 1–4 | 0 |
| `check-release` | check + e2e | 0 |
