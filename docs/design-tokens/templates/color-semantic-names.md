# color-semantic-names.md

> 语义色名 **SSOT 种子**。实现仓可增用途名，**禁止**平行同义第二套。  
> 与 [ui-ux templates/tokens.example.md](../../ui-ux/templates/tokens.example.md) 对齐。

| token path | 用途 | 禁同义词（不得作正式消费名） |
|------------|------|------------------------------|
| `color.bg` | 页面/画布底 | `canvas-alt`、`page-white`（同义并存） |
| `color.fg` | 正文 | `ink-strong`、`ink`、`body-black` |
| `color.primary` | 主 CTA / 品牌强调 | `brand`、`coral-bright`、`accent-1`（同义并存） |
| `color.danger` | 破坏性 | `error-red`、`destructive-alt`（同义并存） |
| `color.muted` | 辅助文字 | `faint`、`ink-muted`、`subtle-text` |
| `color.border` | 默认边框（可选） | `line-hair`、`stroke-1`（同义并存） |
| `color.fg.inverse` | 深底上的字（可选；仍非第二词表） | `on-dark` 若已用 inverse 则删 on-dark |

## 规则

1. 新增行 = 新**用途**；不是给同一用途起第二个名字。  
2. 迁移：改 call site → 删禁同义词 → lint 加禁串。  
3. primitive palette（`color.palette.*`）可存在；**UI 默认不引用** palette 路径。
