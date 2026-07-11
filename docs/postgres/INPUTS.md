# INPUTS — 缺则停

| # | 项 | 验收 |
|---|-----|------|
| 1 | **业务实体清单** | 每实体：`表名` \| 不变量一句 \| 主键列 \| **列清单**（`列名` \| 业务含义一句 \| 类型意向）\| **租户范围**（§4=行级时必填：`tenant`=含 `tenant_id` 且进 RLS；或 `global`=无 RLS）。§4=无时租户范围填 `N/A` |
| 2 | **DATABASE_URL 名** | staging/prod **成对**；值不入库 |
| 3 | **迁移工具** | 默认 □ Atlas（须勾）；换工具书面+理由 |
| 4 | **多租户** | □ 无 □ `tenant_id` 行级（**唯一支持模式**；schema-per-tenant = 本册不做）。行级时：`tenant_id` 类型默认 **`uuid`**（改须写明） |
| 5 | **RLS** | □ 要 □ 不要+理由（有多租户默认要） |
| 5b | **RLS 角色**（仅 §5=要） | 应用连接角色名默认 **`app`**（无 `BYPASSRLS`、非表 owner）；迁移 URL 名默认 **`DATABASE_URL_MIGRATE`**（owner/超级用户）。§5=要时 **必须** 提供与 §2 成对的 migrate URL 名（可与 app URL 同主机不同 role）。`commands` `migrate` 只用 migrate URL |
| 6 | **扩展** | 列表或 `N/A`（例 `pgcrypto`） |
| 7 | **备份** | RPO/RTO 数字；或 `裁剪：开发 only` |
| 8 | **应用册** | `go` / `fastapi` / `nextjs` / `N/A`。**`N/A` 时**：事务/RLS 探针宿主钉死为 **`psql` + `db/tests/*.sql`**（由 `test` 脚本调用），禁止无宿主 |
| 9 | **错误映射** | SQLSTATE→应用码表或默认见 `05` |
| 10 | **隔离级别** | 默认 READ COMMITTED；改则写明 |
| 11 | **钱类型** | □ `bigint` 最小货币单位 □ `numeric(p,s)`（须写 p,s） |
| 12 | **statement_timeout** | 在线默认 `15s`（见 `05`）。批处理/长任务：写明秒数 **或** `N/A`（无批处理，仅用在线默认） |
| 13 | **Atlas 迁移目录** | 默认 `file://db/migrations`（与 `02` 一致）；改路径须书面 + 同步 `commands`/`atlas.hcl` |

缺任一项谓词 → 停写。全部满足后输出：

```text
INPUTS OK
```
