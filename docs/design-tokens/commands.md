# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | INPUTS §1–12 谓词（若适用含 §13–16） | exit 0 |
| `tokens:build` | Style Dictionary 自 DTCG 源生成产物 | exit 0 |
| `tokens:check-drift` | 重建产物 vs 已提交/锁定哈希；含禁色名与（若启用）ui-ux 路径同名 | exit 0 |
| `test` | Lifecycle 探针：源解析、build、消费禁令、alias 无环 | exit 0 |
| `check-acceptance` | `11` A+B+D 可勾项 | exit 0 |
| `check` | check-inputs + tokens:build + tokens:check-drift + test + check-acceptance | exit 0 |
