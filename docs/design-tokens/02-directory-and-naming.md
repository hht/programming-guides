# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
# 实现仓建议落点（按应用册微调；词根不变）
tokens/                         # DTCG 源（唯一正式源）
  primitive/                    # 原始色板、基准间距数字
    color.json
    space.json
    ...
  semantic/                     # 语义层（UI 默认消费）
    color.json                  # color.bg / color.fg / color.primary …
    typography.json
    ...
  component/                    # 可选；只引用 semantic
style-dictionary.config.js      # 或 .mjs / .ts — 唯一 transform 配置
src/styles/                     # 或 shared/styles/
  tokens.css                    # SD 产物（例）
  theme.css                     # 若需 @theme 映射：只映射语义名，不发明第二套色名
scripts/
  tokens-build.*                # 可选薄封装；逻辑在 SD
docs/design/                    # 若启用 ui-ux：tokens.md 与语义路径同名
UBIQUITOUS_LANGUAGE.md          # 含 Token 词表节
```

依赖方向：

```text
DTCG source → Style Dictionary → 产物（css/js/…）→ UI 组件 / 样式
ui-ux design/tokens.md | Figma Variables ──同名──► semantic paths
```

**禁**组件 → 自造色常量 → 反向写回源。  
**禁** `tokens-legacy/` 与 `tokens/` 长期并存（迁移窗口须有删除日）。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建或更新 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。  
2. **语义色**用用途名：`color.bg`、`color.fg`、`color.primary`、`color.danger`、`color.muted`（或 INPUTS 钉死的等价集合）——**不是**设计师口语 `blue-2`、`coral-bright` 当唯一消费名。  
3. **禁**第二套色名：不得同时存在 `text-foreground` 与 `ink-strong` / `faint` 两套正式消费名。迁移 = 改 call site + 删旧名。  
4. **禁**技术翻译主名：`TokenManager`、`ThemeHelper`、`handleColors` 作领域主模块名。基础设施可用 `style-dictionary.config`。  
5. primitive 可用色板编号（`color.palette.neutral.100`）；**UI 不直接绑** palette 名（除非 INPUTS 例外）。

| 概念 | 正例 | 反例 |
|------|------|------|
| 语义色 | `color.fg`、`color.primary` | `ink-strong`、`faint`、`blue2`（作唯一消费名） |
| 间距 | `space.2`、`space.md` | `gap-weird`、`spacingAlt` |
| 产物变量 | `--color-fg`、`--space-2` | `--ink-strong`、`--old-fg` 并行正式 |
| 操作 | `buildTokens`、`checkTokenDrift` | `handleTheme`、`syncColorsMagic` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| DTCG 路径 | `.` 分段；文件内嵌套对象对应路径 |
| CSS 变量 | `--` + 路径 kebab（`color.fg` → `--color-fg`）；全文一种算法 |
| 文件名 | `kebab-case` 或 `semantic/color.json` 目录约定；全文一种 |
| npm scripts | `tokens:build`、`tokens:check-drift`、`check` |
| 主题选择器 | light=`:root`；dark=INPUTS 钉（默认 `[data-theme="dark"]` 或 `.dark`）——**同一语义变量名** |
