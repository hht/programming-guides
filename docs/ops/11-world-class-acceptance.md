# 11 — 世界级验收

## A. 工程面（§1.2）

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` |
| 命名 / 词表 | [ ] | `02` Pass1 服务/密钥业务名 + tag 语法 |
| 代码风格 | [ ] | 声明式配置 |
| 工具链 | [ ] | `01` Docker/Compose/Kamal/GHA |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 指南无业务服务实现 |
| 逻辑清晰可测 | [ ] | health/回滚探针 |
| 关键路径 | [ ] | `05` |
| 测试 | [ ] | `09` |
| 安全（应用层） | [ ] | 密钥/非 root/供应链 |
| 无障碍 / 性能 | [ ] | 裁剪：无 UI a11y；性能=健康超时预算 |
| 运维第三方 APM | N/A 参考 | INPUTS §11 |

## B. 功能共有（≥2 URL）

| 能力 | sources | 勾选 |
|------|---------|------|
| 容器化运行 | https://github.com/docker/compose · https://github.com/basecamp/kamal | [ ] |
| CI 构建/发布 | https://github.com/actions/starter-workflows · https://github.com/basecamp/kamal | [ ] |
| 声明式部署 | https://github.com/basecamp/kamal · https://github.com/docker/compose | [ ] |
| 配置与密钥分离 | https://github.com/docker/compose · https://github.com/actions/starter-workflows | [ ] |
| 健康/可用性意识 | https://github.com/basecamp/kamal · https://github.com/docker/compose | [ ] |
| 回滚/上一版本 | https://github.com/basecamp/kamal · https://github.com/actions/starter-workflows | [ ] |

## C. 达到 / 超越（§1.3）

1. [ ] 能力切条 
2. [ ] 共有 ≥2 源 
3. [ ] 功能面 ⊇ 共有 
4. [ ] 工程面有章节+勾选 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中更弱/未见「健康门闸未过不得标成功」硬门闸 → 本指南要求健康检查未通过不得标记发布成功（见 05/06）` 
 - [ ] a2. `对照：B 中更弱/未见「上一版本可切回作为默认回滚」硬门闸 → 本指南要求保留 previous-release 并可一键切回（见 05/06）` 
 - [ ] b. `09` 矩阵 1–6 
 - c. N/A 

## D. 交付环境

| 项 | 勾选 |
|----|------|
| staging/prod 密钥已配置（值不在仓） | [ ] |
| 镜像仓库可达或 local-only | [ ] |
