# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

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

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建 `UBIQUITOUS_LANGUAGE.md`（表/列 = 业务实体与属性）。  
2. **表、列、约束、索引名**表达业务事实（`orders`、`placed_at`），禁 `data`、`tmp`、`entity`、`obj`、`val`。  
3. **禁**同义词分叉：`customer`/`user` 指同一角色则词表只留一个。  
4. 迁移描述用业务变更语义（`add_order_status`），禁 `update1`。  
5. `tenant_id` 等横切列若启用，在词表钉死含义。

| 概念 | 正例 | 反例 |
|------|------|------|
| 表 | `orders` | `tbl_data` / `entities` |
| 列 | `placed_at` | `ts` / `flag1` |
| 迁移 | `..._add_order_status.sql` | `..._fix.sql` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| 表 | `snake_case` 复数或团队统一单数（INPUTS 钉一种，默认复数） |
| 列 | `snake_case`；FK=`<table_singular>_id` |
| 迁移文件 | Atlas 默认时间戳命名，禁手改已 apply 文件 |
| 租户列 | 固定 `tenant_id`（若行级） |
