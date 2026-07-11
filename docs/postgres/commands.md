# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | §1–11 谓词 | exit 0 |
| `migrate` | `atlas migrate apply --url "$DATABASE_URL"` 对空库 | exit 0 |
| `test` | 事务回滚 +（若 RLS）跨租户用例 | exit 0 |
| `check-acceptance` | `11` 可勾项 | exit 0 |
| `check` | check-inputs + migrate + test + check-acceptance | exit 0 |
