# 11 — 世界级验收

## A. 工程面（§1.2）

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` |
| 命名 / 词表 | [ ] | `02` Pass1 业务 task/screen-id + join key |
| 代码风格 | [ ] | token 一致 `01` |
| 工具链 | [ ] | Figma |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 指南无业务实现 |
| 逻辑清晰可测 | [ ] | 评审探针 |
| 关键路径 | [ ] | `06` |
| 测试 | [ ] | `09` |
| 安全（应用层） | [ ] | 破坏性确认 |
| 无障碍 / 性能 | [ ] | `07`；动效可停 |
| 运维第三方 | N/A | **不进必勾** |

## B. 功能共有（用户可感知；≥2 URL）

| 能力 | sources | 勾选 |
|------|---------|------|
| 清晰主操作 | https://github.com/shadcn-ui/ui · https://github.com/primer/design | [ ] |
| 组件多状态 | https://github.com/shadcn-ui/ui · https://github.com/material-components/material-web | [ ] |
| 可访问默认 | https://www.w3.org/TR/WCAG22/ · https://github.com/shadcn-ui/ui | [ ] |
| Token/主题 | https://m3.material.io/ · https://github.com/primer/design | [ ] |
| 模式文档化 | https://github.com/primer/design · https://developer.apple.com/design/human-interface-guidelines/ | [ ] |
| 平台适配 | https://developer.apple.com/design/human-interface-guidelines/ · https://m3.material.io/ | [ ] |

## C. 达到 / 超越（§1.3 全文条件）

1. [ ] 能力切条（每条=用户可感知；禁整站一条）  
2. [ ] 共有判定：能力在 B 的 ≥2 证据源出现；仅 1 源→可选  
3. [ ] 功能面：必做 ⊇ 所有共有  
4. [ ] 工程面：§1.2 必做维有章节+本表勾选  
5. [ ] 超越须 **同时 a+b**：  
   - [ ] a1. `对照：B 中更弱/未见「每交互组件强制状态矩阵交付」硬门闸 → 本指南要求（06/05）`  
   - [ ] a2. `对照：B 中更弱/未见「WCAG 2.2 AA 作为设计完成门闸」硬门闸 → 本指南要求（07）`  
   - [ ] b. `09` 矩阵 1–6 已走通  
   - c. N/A（非全 P1w）  

## D. 交付环境

| 项 | 勾选 |
|----|------|
| Figma 实现方可访问 | [ ] |
| handoff.md 完整 | [ ] |
