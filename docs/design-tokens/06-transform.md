# 06 — Transform（Style Dictionary）

## 不变量

- **唯一**正式变换：Style Dictionary。 
- 输入：DTCG 源；输出：INPUTS §5 勾选的平台文件。 
- 变换不发明色名：输出名 = 源路径的确定性映射（`02`）。

## 步骤规格（实现自写）

### 1. 配置

1. 自 [templates/style-dictionary.config.example.js](./templates/style-dictionary.config.example.js) 复制语义。 
2. `source: ['tokens/**/*.json']`（或等价 glob）；勿把产物目录放进 source。 
3. DTCG：依赖 SD 自动检测 `$value`/`$type`；仅当检测失败时显式 `usesDtcg: true`。 
4. 禁止第二份 `style-dictionary.config.legacy.js` 作并行正式配置。

### 2. 平台：css-variables（Web 默认）

1. `transformGroup: 'css'`（或项目写明的等价组）。 
2. `format: 'css/variables'`；`destination` 约定路径（例 `src/styles/tokens.css`）。 
3. 选择器：light → `:root`；dark → INPUTS 约定选择器，**同一套** `--color-*` 名。 
4. dimension 带单位：默认 `px`（或 INPUTS 约定 `rem` 换算规则，须单处）。

### 3. 可选平台

| 平台 | 何时 | 要点 |
|------|------|------|
| js/ts | 需要运行时读 token | 只导出 semantic；禁把整份 primitive 当公共 API |
| ios | INPUTS 勾选 | 颜色/字号进资产或 Swift 生成物；名与 semantic 对齐 |
| android | INPUTS 勾选 | XML color / Compose theme；名对齐 |

未勾选 = 不生成、不维护。

### 4. Build 脚本

1. `tokens:build` → 调用 SD `buildAllPlatforms`（或现行 API 等价）。 
2. `tokens:check-drift`：干净临时目录 rebuild，与已提交产物 diff；或 hash 锁定——INPUTS §12 选定一种。 
3. 失败退出非 0；禁止 `|| true`。

### 5. 映射层（可选一层）

若应用使用 Tailwind `@theme` / shadcn 语义类：

- 允许 **一层** 映射：`--color-fg` → `--foreground` / `foreground` utility。 
- 映射表必须 1:1 来自色名 SSOT；**禁止**映射出未登记的第二套名。 
- 映射文件若手写，须进 drift 或由 SD 自定义 format 生成（优先生成）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 未知 format | 配置错误；修配置 |
| 产物与源不一致 | drift 非 0 |
| 自定义 transform 改写语义名 | 禁止（除非词表变更同 PR） |
| 多 platform 同名冲突 | 分 destination；共享命名算法 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| build | 产物含 `--color-fg`（或约定算法结果） |
| 改源重建 | 产物字节/语义变更可预期 |
| drift | 故意改产物 → check 红 |
| 未勾选 ios | 无 ios 产物路径 |
