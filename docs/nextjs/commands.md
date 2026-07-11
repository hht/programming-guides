# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | INPUTS 谓词 | OK |
| `lint` | eslint + tsc | 0 |
| `test` | vitest | 0 |
| `build` | next build | 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C；C 仅维护者） | OK |
| `check` | 上列全部 | 0 |
| `e2e` | playwright：`09` 矩阵 1–4 中非 N/A 项（§5=无则跳过 #4） | 0 |
| `check-release` | check + e2e | 0 |
| `check-guide` | `11` **C** 节（维护者） | OK |
