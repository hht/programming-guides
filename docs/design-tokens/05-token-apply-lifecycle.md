# 05 — Token Apply Lifecycle（核心）

## 不变量

- 全文唯一核心路径名：**Token Apply Lifecycle**。  
- 顺序钉死：**source tokens → transform → consume in UI**。  
- 任一步跳过或逆流（UI 改 hex 不回源、手写第二产物）= **非法**。  
- 色名 SSOT 贯穿三步；**禁止第二套色名**在任一步引入。

## 步骤规格（实现自写）

### 1. Source tokens

1. 确认 `INPUTS OK`；色名表已钉（`03`）。  
2. 在 `tokens/` 写入/更新 **DTCG** 源（`04`）：primitive → semantic（→ component?）。  
3. 若启用 ui-ux：核对 Figma Variables / `design/tokens.md` 与 semantic **路径同名**。  
4. 门闸：源可被 Style Dictionary 解析；alias 无环。  
5. **本步不**直接改 UI 组件样式文件（除后续消费映射的约定入口）。

### 2. Transform

1. 唯一入口：Style Dictionary 配置（`06`）。  
2. 执行 `tokens:build`（名可钉）：读 DTCG → 平台 format → 写出产物（默认 `css/variables`）。  
3. 产物路径与变量命名算法固定（`02` Pass2）；light/dark 共用语义名。  
4. 门闸：build exit 0；产物 diff 可审；无手工并行维护的第二 CSS 色表。  
5. 可选：生成 JS/TS 或原生平台文件（仅 INPUTS §5 勾选）。

### 3. Consume in UI

1. 应用样式入口 **只**导入 SD 产物（及允许的一层映射，如 `@theme` 把 `--color-fg` 映到 `foreground`——映射表不得发明未登记色名）。  
2. 组件 / 样式：使用语义 utility 或 `var(--color-*)`；**禁止**裸品牌 hex；**禁止**第二套色名 class。  
3. 新 UI 需求要新色：回到步骤 1 加 semantic（或 primitive+alias），再 transform，再消费——**禁止**在组件文件「临时 hex」。  
4. 门闸：`tokens:check-drift` + 色名 lint 绿（`07`/`09`）。

### 伪代码（规格级）

```text
apply_lifecycle():
  assert inputs_ok()
  source = load_dtcg("tokens/**")          # step 1
  assert no_second_color_vocab(source)
  assert aliases_acyclic(source)
  maybe_assert_figma_path_parity(source)   # if ui-ux enabled

  artifacts = style_dictionary.build(source, config)  # step 2
  write(artifacts)  # css vars / optional platforms

  ui.bind(artifacts.semantic_only)         # step 3
  assert no_raw_brand_hex_in_components()
  assert no_banned_color_aliases()
  return OK
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 源解析失败 | 阻塞；不发布半套产物 |
| build 成功但 UI 仍用旧第二套色名 | `check` 失败 |
| 只改产物、源未改 | drift 失败（产物应可从源重建；CI 比对应一致） |
| 设计改 Variables、工程未跟 | 启用 ui-ux 时 drift 失败 |
| 需要「一次性」hex  hotfix | 禁止进主路径；须补源 + rebuild（快改须书面 deferred） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 快乐路径 | 改 semantic `$value` → build → UI 所见色变；无第二套名 |
| 跳过 transform 手改 CSS | CI drift 红 |
| 组件新增 `ink-muted` | lint 红 |
| 组件写 `#FF0000` 品牌红 | lint 红（或 allowlist 空） |
| alias 环 | build 红 |
| dark 切换 | 同名变量；无 `*-dark` 平行消费名 |
