# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | INPUTS §1–10 谓词（若适用含 §11–17） | exit 0 |
| `check-messages` | 全 locale key 全等（或 INPUTS 差分）+ ICU 语法校验 | exit 0 |
| `check-hardcoded` | features 用户可见硬编码串门禁（白名单除外） | exit 0 |
| `test` | Lifecycle 探针：detect、load、t(known)、缺 key fail、locale 切换 | exit 0 |
| `check-acceptance` | `11` A+B+D 可勾项 | exit 0 |
| `check` | check-inputs + check-messages + check-hardcoded + test + check-acceptance | exit 0 |
