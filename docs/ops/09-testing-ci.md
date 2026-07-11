# 09 — 测试与发版矩阵

## 单测/探针（须有 commands 入口）

| case | 命令 | 期望 |
|------|------|------|
| 密钥名/入库 | `check-secrets-names` | 名表同构；无私钥块 |
| health 假 URL | `healthcheck`（对不可达 URL） | 非 0 |
| action 浮动版本 | `check-actions-sha` | 非 0 |
| 缺密钥启动 | 目标仓应用启动（应用指南 `check`；本 ops 册不重复造启动命令） | 非 0 |

## 发版矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | 本地 `compose up` + health | 200 |
| 2 | CI `docker build` | 成功 |
| 3 | 发布新坏版本 | 不标成功；回滚或失败明确 |
| 4 | 回滚到 PREV | 健康绿 |
| 5 | 密钥未进 git | 扫描/评审过 |
| 6 | staging/prod 密钥名同构 | diff 空 |

## CI

PR：`check`（覆盖矩阵 #2 构建、#5 密钥名、#6 同构、action SHA）。 
发版：`release`（覆盖 #1/#3/#4 健康与回滚路径）。 
第三方 APM 不进必勾。
