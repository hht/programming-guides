# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | §1–13 谓词 | exit 0 |
| `migrate` | `atlas migrate apply --dir file://db/migrations --url "${DATABASE_URL_MIGRATE:-$DATABASE_URL}"`（空库）。**RLS 开启时**：须设 `DATABASE_URL_MIGRATE`=owner（§5b），**禁止**用 `app` 角色跑 migrate | exit 0 |
| `test` | 覆盖 `09` 探针：事务回滚 + SQLSTATE 映射抽检 +（若 RLS）跨租户；宿主=应用册测试 **或**（§8=`N/A`）`psql -f db/tests/*.sql` | exit 0 |
| `check-acceptance` | 自检 `11` **A+B+D**（跳过 C） | exit 0 |
| `check` | check-inputs + migrate + test + check-acceptance | exit 0 |
| `release` | `check` + staging `migrate` 成功记录（日志/CI artifact 含 apply 时间与 revision）+ `09` 发版矩阵 1–6 全过 | exit 0 |
| `check-guide` | `11` **C** 节（维护者） | exit 0 |

PR：`check`。发版：`release`。指南本身达标：`check-guide`。
