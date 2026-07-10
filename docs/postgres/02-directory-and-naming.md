# 02 — 目录与命名

```text
db/
  migrations/           # Atlas 版本 SQL，唯一 schema SSOT
  schema/               # 可选：期望态/文档
  seeds/                # 可选非生产
compose.yaml
ops/
  backup.md             # 若未裁剪备份
```

依赖：`migrations → 应用代码`；禁应用启动时 `CREATE TABLE`。

| 种类 | 规则 |
|------|------|
| 表 | `snake_case` 复数或团队统一单数（INPUTS 钉一种，默认复数） |
| 列 | `snake_case`；FK=`<table_singular>_id` |
| 迁移文件 | Atlas 默认时间戳命名，禁手改已 apply 文件 |
| 租户列 | 固定 `tenant_id`（若行级） |
