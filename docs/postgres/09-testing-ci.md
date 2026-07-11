# 09 — 测试与 CI

## 探针（`test` 脚本须覆盖）

| case | 命令 | 期望 |
|------|------|------|
| 空库迁移 | `migrate` | exit 0 |
| 事务回滚 | `test` | 第二句失败后第一句不可见（见 `05`） |
| SQLSTATE `23505` | `test` | 映射 `conflict`（或 INPUTS §9）；已 ROLLBACK |
| RLS（若启用） | `test` | 跨租户 0 行 |
| 无 URL | 启动/migrate | 非 0 |
| 备份/裁剪 | 评审 | INPUTS §7 数字或「裁剪：…」行存在 |

## 发版矩阵（`release` 绑定）

| # | 场景 | 断言 | 绑定 |
|---|------|------|------|
| 1 | 空库 migrate | 成功 | `migrate` |
| 2 | 约束违反 | 正确 SQLSTATE 映射 | `test` |
| 3 | 事务失败 | 全回滚 | `test` |
| 4 | RLS（若启用） | 隔离；未启用则 N/A + INPUTS §5 理由 | `test` 或裁剪 |
| 5 | 备份文档或裁剪行 | 存在 | `check-inputs` §7 |
| 6 | `check` | 0 | `check` |

PR：`check`。发版：`release`（见 [commands.md](./commands.md)）。
