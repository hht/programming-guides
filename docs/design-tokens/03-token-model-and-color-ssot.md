# 03 — Token 模型与色名 SSOT

## 不变量

- 三层（或两层）单向：`primitive → semantic →（可选）component`。  
- **色名 SSOT 唯一**：语义消费名只有一套；**禁止第二套色名**。  
- UI 默认只读 semantic（或 component）；primitive 仅出现在源与 SD 解析中。

## 步骤规格（实现自写）

### 1. 钉分层

1. **primitive**：原始色板、基准数字（4/8/16…）、字号原始值。无业务语义。  
2. **semantic**：用途名（背景、正文、主行动、危险、边框、静音色…）。`$value` 引用 primitive（DTCG alias）或成对 light/dark 值。  
3. **component**（可选）：`button.primary.bg` 等；**只** alias semantic；禁直接 hex。

### 2. 钉色名表（禁第二套）

1. 采用 INPUTS §3 表（默认种子见 [templates/color-semantic-names.md](./templates/color-semantic-names.md)）。  
2. 与 [ui-ux templates/tokens.example.md](../ui-ux/templates/tokens.example.md) 列对齐：`color.bg` / `color.fg` / `color.primary` / `color.danger` / `color.muted` 等。  
3. **拒绝登记**：任何与语义名同义的平行正式名（例：已有 `color.fg` 则不得再正式化 `ink-strong`）。  
4. 遗留名：列入「删除清单」+ 截止日期；deadline 后 lint 失败。

### 3. 非颜色 token

| 族 | 最小集合（默认） | 备注 |
|----|------------------|------|
| space | 1..n 步进（默认 4 基） | 对齐 ui-ux `01` |
| font.size / font.line-height | body、title 至少 | Web 默认 16/24 |
| radius | sm/md/lg 或数字档 | 全文一种命名 |
| shadow | 可选；无则 N/A | 只动画/阴影值，不发明色名 |

### 4. 主题

- light/dark：**同一** semantic 路径，不同 `$value`（或 mode 扩展，INPUTS 钉一种）。  
- **禁止** `color.fg.dark` 作为与 `color.fg` 平行的第二消费名（模式由选择器切换变量值）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| PR 新增第二套色 utility | `tokens:check-drift` / lint **失败** |
| 组件引用 primitive 路径 | 默认失败；INPUTS 书面 allowlist 除外 |
| 语义名与 ui-ux 表不一致 | BLOCKED（§7 启用时） |
| 只改 CSS 产物不改源 | 漂移检查失败 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 语义色表 | 含 bg/fg/primary/danger/muted（或 INPUTS 等价全集） |
| 扫描 call site | 无已禁第二套色名字符串 |
| component token | 解析后最终落到 semantic/primitive，无环 |
| dark 模式 | 变量名集合 ⊆ light；无新增平行色名 |
