# 来源、标杆与差距表

## P0

| 主题 | URL |
|------|-----|
| Apple HIG | https://developer.apple.com/design/human-interface-guidelines/ |
| Material Design 3 | https://m3.material.io/ |
| WCAG 2.2 | https://www.w3.org/TR/WCAG22/ |
| Figma Auto Layout | https://help.figma.com/hc/en-us/articles/360040451373 |

## 标杆 \(B\)（3 开源）

| ID | 仓库 | 品类匹配 | 学什么 | 不学什么 |
|----|------|----------|--------|----------|
| A | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | 可访问组件与变体思维 | 变体、组合、a11y 默认 | 整站抄视觉皮肤 |
| B | [material-components/material-web](https://github.com/material-components/material-web) | Material 组件语义 | 状态、密度、主题 token | 绑死 Web Components 实现 |
| C | [primer/design](https://github.com/primer/design) | 设计指南开源仓 | 原则、模式文档结构 | GitHub 产品业务 |

## 能力切条 → 共有

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 清晰层级 / 主操作 | ✓ | ✓ | ✓ | 必做 |
| 组件多状态 | ✓ | ✓ | ✓ | 必做 |
| 可访问默认 | ✓ | ✓ | ✓ | 必做 |
| 设计 token / 主题 | ✓ | ✓ | ✓ | 必做 |
| 文档化模式 | ✓ | ✓ | ✓ | 必做 |
| 跨平台适配说明 | ✓ | ✓ | ✓ | 必做 |

## 差距表

| 缺口 | 落入 | 必做 |
|------|------|------|
| 一屏一主任务 | `03`/`06` | 必做 |
| 状态矩阵交付 | `05`/`06` | 必做（超越） |
| WCAG AA 硬门闸 | `07` | 必做（超越） |
| Figma 命名/Auto Layout | `08` | 必做 |
| 目录与 join key | `02` | 必做 |
| 运维第三方 | — | 参考 N/A |

## 冲突

| 冲突 | 裁决 |
|------|------|
| 跟风「AI 生成整页视觉」 | **钉决策生命周期 + 可验收矩阵**；美观人审，不进必勾美学分 |
| 跨端强行同一导航 | **平台配置优先**（导航可不同，token 可共享） |
