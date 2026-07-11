# 01 — 栈（钉死）

| 层 | 选择 |
|----|------|
| **源格式** | **W3C Design Tokens（DTCG）**：`$value` / `$type` / 可选 `$description` |
| **变换** | **Style Dictionary**（当前主线；DTCG 源，`usesDtcg` 可自动检测） |
| **Web 默认产物** | `css/variables`（`:root` / 主题选择器自定义属性）→ 再映射到应用样式系统（Tailwind `@theme` / CSS 变量消费等） |
| **可选产物** | JS/TS 模块；iOS / Android 平台文件（INPUTS §5 勾选才建） |
| **设计侧对齐** | [ui-ux](../ui-ux/README.md)：写 SSOT = `design/tokens.md`；Figma Variables **同名镜像**；冲突以 `tokens.md` 为准。工程 build SSOT = 本册 DTCG |
| **禁止** | Theo / 手写多副本 hex 同步 / 组件内平行色常量文件作正式 SSOT；DTCG 与 legacy SD 格式双源 |

禁止：留下「Style Dictionary 或 Tokens Studio 任选」双开口；留下「先用 JSON 任意形状」不写 DTCG。

## 脚手架

```bash
# 1) 建 tokens/ 源树（DTCG）；色名表对齐 templates/color-semantic-names.md
# 2) 复制 templates/style-dictionary.config.example.js 语义到实现仓；钉 platforms
# 3) package.json scripts：tokens:build / tokens:check-drift（名可 INPUTS 钉）
# 4) 跑 build → 产物进约定路径（例 src/styles/tokens.css）
# 5) UI 只引用语义变量 / 映射 utility；加 lint：禁第二套色名、禁裸品牌 hex（07）
# 6) 若启用 ui-ux：核对 design/tokens.md（写 SSOT）与 DTCG 语义路径同名；Variables 须镜像（08）
```

## 版本

| 项 | 策略 |
|----|------|
| Style Dictionary | 当前主线 major；升级须回归 DTCG 解析 + 产物 diff |
| DTCG | 跟 W3C Design Tokens 社区组现行格式；`$value`/`$type` 必遵 |
| Node | 与应用册一致（建议 LTS） |

## 冲突裁决（写入 sources）

| 冲突 | 裁决 |
|------|------|
| Tokens Studio / Figma 插件生态更「设计向」 | **工程正式变换仍钉 Style Dictionary**；Figma 只作源导出边界（`04`/`08`） |
| 仅用 Markdown token 表（ui-ux templates） | **设计草稿可**；进工程仓必须升格 DTCG + SD，不得以 md 表当运行时 SSOT |
| 流行「手写 theme.css 不跑 SD」 | 允许**仅当** theme.css **是** SD 唯一产物且源仍为 DTCG；禁止人手维护第二份 |
| 先进性 vs 下载量 | **DTCG 源 + SD 变换**为先进边界；下载量不单独定胜负 |
