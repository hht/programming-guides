# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写 token 流水线实现**。  
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词。

## 必填

| # | 项 | 验收（合格谓词） |
|---|-----|------------------|
| 1 | **源格式（互斥钉死）** | □ **W3C DTCG**（`$value` / `$type`；本指南默认且唯一允许）。**禁止**「DTCG 或 legacy Style Dictionary 旧格式任选」双开口；存量迁移须有一次性计划，完成后只留 DTCG |
| 2 | **变换工具链（互斥钉死）** | □ **Style Dictionary**（当前主线；DTCG 源）。**禁止**平行第二 transform（Theo / 自研 dump / 手写复制 CSS）作正式路径 |
| 3 | **色名 SSOT** | 语义色名表已钉（可复制 [templates/color-semantic-names.md](./templates/color-semantic-names.md)）；**禁止**第二套平行色名（如 `ink-*`、`faint`、`on-dark` 与 `foreground` / `muted-foreground` 并存） |
| 4 | **Token 分层** | 至少：`primitive` → `semantic`；组件层 □启用 □禁用。组件层若启用，只引用 semantic，禁直绑 primitive hex |
| 5 | **输出平台（≥1）** | 勾选且钉产物路径：□ **css-variables**（默认 Web）□ **js/ts module** □ **ios**（Swift / asset catalog 语义）□ **android**（XML / Compose theme）□ **其它**（书面 format 名） |
| 6 | **主题模式** | □ light-only □ light+dark 成对。dark 若要：同一语义名，值成对；禁 dark 另造色名 |
| 7 | **与 ui-ux 对接** | □ 启用：设计侧写 SSOT = `design/tokens.md`；Figma Variables 须同名镜像；路径与本册语义路径 **同名**（见 [ui-ux](../ui-ux/README.md) `00`）□ **N/A — 纯工程仓无设计册**（acceptance 写裁剪；仍须完成本册 Lifecycle） |
| 8 | **品牌种子** | 主色 / 危险色 / 正文底与字：hex 或「系统」；须能映射进 §3 语义名（不得只写 hex 散落组件） |
| 9 | **间距 / 字阶 / 圆角基线** | 钉：间距步进（默认 4）、正文字号/行高（Web 默认 16/24）、圆角档位数；与 ui-ux `01` 默认可对齐 |
| 10 | **消费禁令确认** | 勾选：□ 组件/样式 **不**写裸品牌 hex（除 primitive 源文件）；□ **不**新增第二套色 utility；□ UI 只引用 transform 产物或映射后的语义 utility |
| 11 | **应用册对接** | □ react □ nextjs □ 其它 Web □ apple-platforms □ android-compose □ 多册 — 本册为 Token Apply Lifecycle SSOT |
| 12 | **环境 / CI** | PR 必跑 `tokens:build`（或钉名）+ drift check；产物 □提交仓内 □仅 CI 生成（钉死一；默认 **提交生成物或 lock 哈希** 以便 diff） |

## 若适用

| # | 项 | 何时 |
|---|-----|------|
| 13 | **Figma Variables 同步** | 有正式 Figma：钉同步方向（默认 **设计 Variables → 导出 DTCG → transform**；反向须书面） |
| 14 | **多品牌 / 白标** | 默认不做；若要：品牌只换 primitive，semantic 名不变 |
| 15 | **动画 / motion token** | 默认 N/A；若要：只进 duration/easing 类型，不进第二套色 |
| 16 | **a11y 对比抽检** | 默认：semantic 正文字色对背景 ≥4.5:1（对齐 WCAG 2.2 AA）；裁剪须理由 |

## 模式裁剪（钉死）

| 勾选 | 必读章 | 可 N/A |
|------|--------|--------|
| §5 仅 css-variables | 03–07；`06` Web 节 | ios/android 产物节 |
| §7=启用 ui-ux | `04`/`08` 全章 | — |
| §7=N/A | `04` 工程源节；`08` 漂移仍做 | Figma 同步步骤 |
| §6=light-only | — | dark 成对表 |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
