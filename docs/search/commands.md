# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | INPUTS §1–12 谓词 | exit 0 |
| `migrate` | `atlas migrate apply --url "$DATABASE_URL"`（含 FTS；若启用则 vector）对空库 | exit 0 |
| `test` | Lifecycle 探针：命中、scope 不泄漏、empty≠error、同步策略 | exit 0 |
| `check-acceptance` | `11` 可勾项 | exit 0 |
| `check` | check-inputs + migrate + test + check-acceptance | exit 0 |
