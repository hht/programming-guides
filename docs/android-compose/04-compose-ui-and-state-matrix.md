# 04 — Compose UI 与状态矩阵

## 不变量

- Screen Composable **只**：收集 UiState、绑定控件、把交互映射为 Event；**不**持有业务真相。  
- 每个目的地在 [templates/ui-state-matrix.md](./templates/ui-state-matrix.md) 有行；实现必须覆盖矩阵中非 N/A 的态。  
- 主题 / 间距 / 触控目标走 `core/designsystem`；业务文案 key 与词表同词根。  
- 无障碍：INPUTS §12 未裁剪时，图像控件有 `contentDescription`；可点目标 ≥48dp。

## 步骤规格（实现自写）

1. **填矩阵**（INPUTS §3）  
   - 列：`loading` / `empty` / `error` / `success` / `not-found`（详情）/ 可选 `offline`。  
   - 每格：设计 frame 名或「同 success + overlay」；禁止空白必做格。  

2. **Screen 骨架**  
   ```text
   XxxScreen(viewModel):
     state = viewModel.uiState.collectAsStateWithLifecycle()
     when (state) { loading → …; empty → …; error → …; success → … }
     // 交互 → viewModel.onEvent(...)
   ```  

3. **预览**  
   - 至少为 `success` + `error`（或 `empty`）提供 `@Preview` 数据；Preview **不**打真网络。  

4. **列表与详情**  
   - 列表 `empty` ≠ 详情 `not-found`（与 react 册同纪律）。  
   - 加载更多若有：写入 UiState（`appending` 等），禁另一套 `mutableStateOf` 真源。  

5. **设计系统**  
   - 颜色/字体/形状集中；禁 Screen 内散落裸 `Color(0xFF…)`（除非 token 未就绪且 PR 注明临时）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 矩阵缺行 | `INPUTS BLOCKED`；不得开工该屏 |
| error + Retry | 发 `Event.Retry`；按钮在 loading 时 disable |
| 无障碍裁剪 | 仅当 INPUTS §12 勾裁剪并在 `11` 写理由 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| UiState.loading | 语义化进度/骨架可见；无假数据当 success |
| UiState.empty | empty 帧；非 error |
| UiState.error | 错误文案 + Retry（若矩阵要求） |
| 点击 Retry | 发出对应 Event（UI Test 或 ViewModel 协作测） |
| 详情 404 | not-found 帧；非 empty |
