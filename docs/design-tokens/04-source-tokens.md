# 04 — Source tokens（DTCG 源）

## 不变量

- 正式源 = **仓库内 DTCG JSON**（路径见 `02`）。  
- `design/tokens.md`（启用 ui-ux 时的**写 SSOT**）；Figma Variables **同名镜像**；均须与 semantic 路径 **同名**，不得各写一套。  
- 源文件不含生成物；生成物目录可 gitignore 或提交——跟 INPUTS §12，但**真相在源**。

## 步骤规格（实现自写）

### 1. 建 DTCG 源

1. 按 `tokens/primitive|semantic|…` 拆分文件（避免单文件巨石）。  
2. 每个 token：`$type`（`color` | `dimension` | `fontFamily` | …）+ `$value`。  
3. 语义色优先 **alias** primitive（例 `"$value": "{color.palette.neutral.0}"`），避免复制粘贴 hex。  
4. 校验：Style Dictionary 能解析；未知 `$type` 不静默吞（升级 SD 或显式 expand）。

### 2. 最小色与间距种子

对齐 ui-ux 例与本册色名表；值来自 INPUTS §8–9：

| 路径 | 类型 | 说明 |
|------|------|------|
| `color.bg` | color | 页面底 |
| `color.fg` | color | 正文 |
| `color.primary` | color | 主 CTA |
| `color.danger` | color | 破坏性 |
| `color.muted` | color | 辅助文字（对比须达标） |
| `space.*` | dimension | 4 基步进 |
| `radius.md` | dimension | 默认档 |
| `font.body` | 组合或拆分 size/lineHeight | 16/24 默认 |

完整形状例：[templates/tokens.dtcg.example.json](./templates/tokens.dtcg.example.json)。

### 3. 与 Figma / ui-ux 边界

| 方向 | 规则 |
|------|------|
| 默认 | 设计 Variables → 导出/转录为 DTCG → 入库 → transform |
| 工程改值 | 改 DTCG → rebuild → **再**同步回 Figma（若启用）；禁止只改 CSS |
| `design/tokens.md` | 可作人读表；**不得**替代 DTCG 成为 build 输入 |
| N/A ui-ux | 仅 DTCG；仍须色名 SSOT |

### 4. 准入门闸

- 新 token：先登词表（Pass1）再写入 JSON。  
- 重命名：同 PR 改源 + 全 call site + 删旧名。  
- 禁止：在源中保留 `deprecated` 永久别名而不设删除日。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| JSON 非 DTCG（缺 `$value`） | build 失败 |
| 断链 alias | build 失败 |
| Figma 名 ≠ 工程路径（启用 ui-ux） | `tokens:check-drift` 失败 |
| 仅更新 tokens.md | 不视为源已更新 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 解析 semantic color | 全部有 `$type: color` 与可解析 `$value` |
| alias 链 | 无环；终端为具体色值 |
| 与色名表 | 表内每名在源中存在（或明确 N/A） |
| ui-ux 同名（若启用） | 设计侧路径集合 = 工程 semantic 集合（允许设计多、工程子集须书面） |
