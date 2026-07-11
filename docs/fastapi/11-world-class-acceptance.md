# 11 — 世界级验收

## A. 工程面（§1.2）

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` |
| 命名 / 词表 | [ ] | `02` Pass1 词表 + 错误码/路由同根 |
| 代码风格 | [ ] | `01` + ruff/mypy |
| 工具链 | [ ] | uv + alembic |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无指南业务实现 |
| 逻辑清晰可测 | [ ] | service 单测 |
| 关键路径 | [ ] | `05` |
| 测试 | [ ] | `09` |
| 安全（应用层） | [ ] | `07` |
| 无障碍 / 性能 | [ ] | 裁剪：HTTP API 无 UI a11y；超时见 `03`；coverage 裁剪见 `08` |
| 运维第三方 | N/A | 不进必勾 |

## B. 功能共有（≥2 sources URL）

| 能力 | sources | 勾选 |
|------|---------|------|
| HTTP JSON API | https://github.com/fastapi/full-stack-fastapi-template · https://github.com/fastapi-users/fastapi-users | [ ] |
| 鉴权或明确无鉴权 | https://github.com/fastapi-users/fastapi-users · https://github.com/zhanymkanov/fastapi-best-practices | [ ] |
| 持久化 + 迁移 | https://github.com/fastapi/full-stack-fastapi-template · https://github.com/zhanymkanov/fastapi-best-practices | [ ] |
| 结构化错误/校验 | https://fastapi.tiangolo.com/ · https://github.com/zhanymkanov/fastapi-best-practices | [ ] |
| 配置/环境分离 | https://github.com/fastapi/full-stack-fastapi-template · https://github.com/zhanymkanov/fastapi-best-practices | [ ] |
| 健康检查/可测 | https://github.com/fastapi/full-stack-fastapi-template · https://github.com/fastapi-users/fastapi-users | [ ] |

## C. 达到 / 超越（§1.3）

1. [ ] 能力切条 
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选 
3. [ ] 功能面达到：必做功能 ⊇ 所有共有能力 
4. [ ] 工程面达到 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中更弱/未见「每个请求强制 X-Request-ID（或缺则生成）写入 structlog 与响应头」硬门闸 → 本指南要求 RequestID（见 05）` 
 - [ ] a2. `对照：B 中更弱/未见「多表或多语句写必须显式事务」硬门闸 → 本指南要求 service 内 begin（见 05/00）` 
 - [ ] b. `09` 所有**适用**矩阵行经 `test-integration` 绿（非固定 1–5） 
 - c. N/A 

## D. 环境

| 项 | 勾选 |
|----|------|
| staging/prod `DATABASE_URL` + Base URL 成对 | [ ] |
