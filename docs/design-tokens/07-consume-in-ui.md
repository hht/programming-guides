# 07 — Consume in UI

## 不变量

- UI **只消费** transform 产物中的语义 token（及允许的一层映射）。  
- **禁止**裸品牌 hex、**禁止第二套色名**、禁止组件内平行 `colors.ts` 当真源。  
- 文案/布局仍跟应用册与 ui-ux；本册只约束「色与度量从哪来」。

## 步骤规格（实现自写）

### 1. 接线入口

1. 全局样式入口 import `tokens.css`（或钉路径）。  
2. 若有 `@theme` / design-system CSS：只映射 SSOT 名（`06`）。  
3. 确认 dark：切换选择器即可，组件 class **不**改色名。

### 2. 组件写法（钉死优先级）

1. **语义 utility / 变量**：`text-foreground`、`bg-background`、`text-primary`、`var(--color-fg)` 等——名 ∈ 色名表。  
2. **字面量白名单**：`text-white` 等 inverse 场景允许（INPUTS 可收窄）；不替代 `color.fg`。  
3. **禁止**：`ink-strong`、`faint`、`coral-bright`、未登记 `text-brand-foo`、散落 `#RRGGBB`（非源文件）。  
4. 间距/圆角：用 token 对应 utility 或 CSS 变量；禁魔法数新档（新档回源）。

### 3. 与 Typography / 组件库

- 字阶：走应用册 Text/typography 原语时，其内部尺寸须来自 token，不得另开 `*-type-scale.ts` 第二套数字 SSOT。  
- 第三方组件 override：仅映射到语义变量；PR 说明理由（对齐应用仓例外政策）。

### 4. Lint / 门禁（实现自写）

| 检查 | 期望 |
|------|------|
| 禁色名表 | rg/eslint 命中 → fail |
| 裸 hex（组件/模块样式） | fail；allowlist 仅测试夹具或 SVG 特例（书面） |
| 未 import 产物却定义 `--color-*` | fail 或 drift |

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 设计师给了新 hex | 不进组件；进 DTCG → build → 再引用 |
| H5 要「另一套弱化色」 | **禁止**新名；调同一 `color.muted` 值或加 **新语义**（用途不同才加） |
| 图表库强制自带色 | 适配层映射到 semantic；不泄漏第二套进业务组件 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 抽样组件 | 无禁色名；无品牌 hex |
| 主题切换 | DOM 选择器变；class 色名不变 |
| 新按钮主色 | 引用 primary 语义；改源可验证 |
| 误加 `text-ink-muted` | CI 红 |
