# INPUTS — 缺则停

| # | 项 | 验收 |
|---|-----|------|
| 1 | **业务实体清单** | 表名 + 不变量一句 + 主键 |
| 2 | **DATABASE_URL 名** | staging/prod **成对**；值不入库 |
| 3 | **迁移工具** | 默认 □ Atlas（须勾）；换工具书面+理由 |
| 4 | **多租户** | □ 无 □ `tenant_id` 行级（**唯一支持模式**；schema-per-tenant = 本册不做） |
| 11 | **钱类型** | □ `bigint` 最小货币单位 □ `numeric(p,s)`（须写 p,s） |
| 5 | **RLS** | □ 要 □ 不要+理由（有多租户默认要） |
| 6 | **扩展** | 列表或 `N/A`（例 `pgcrypto`） |
| 7 | **备份** | RPO/RTO 数字；或 `裁剪：开发 only` |
| 8 | **应用册** | go / fastapi / nextjs / `N/A` |
| 9 | **错误映射** | SQLSTATE→应用码表或默认见 `05` |
| 10 | **隔离级别** | 默认 READ COMMITTED；改则写明 |

```text
INPUTS OK
```
