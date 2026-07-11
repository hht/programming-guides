# 04 — Screen UI 与状态矩阵

## 不变量

- Route 组件 / Screen **只**：订阅 UiState、绑定控件、把交互映射为 Event；**不**持有业务真相。  
- 每个 route 在 [templates/ui-state-matrix.md](./templates/ui-state-matrix.md) 有行；实现必须覆盖矩阵中非 N/A 的态。  
- 主题 / 间距走 `core/designsystem`；业务文案 key 与词表同词根。  
- 无障碍：INPUTS §14 未裁剪时，图像有 `accessibilityLabel`；可点区域足够大。

## 步骤规格（实现自写）

1. **填矩阵**（INPUTS §4）  
   - 列：`loading` / `empty` / `error` / `success` / `not-found`（详情）/ 可选 `offline`。  
   - 每格：设计 frame 名或「同 success + overlay」；禁止空白必做格。  

2. **Screen 骨架**  
   ```text
   XxxScreen:
     { uiState, onEvent } = useXxxScreen(params)
     switch uiState.phase:
       loading → …
       empty → …
       error → … + Retry → onEvent(Retry)
       success → …
     // 交互 → onEvent(...)
   ```  

3. **列表与详情**  
   - 列表 `empty` ≠ 详情 `not-found`。  
   - 加载更多若有：写入 UiState（如 `appending`），禁另一套本地真相。  

4. **设计系统**  
   - 颜色/字体集中；禁 Screen 内散落魔法色值（临时须 PR 注明）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 矩阵缺行 | `INPUTS BLOCKED`；不得开工该屏 |
| error + Retry | 发 `Event.Retry`；loading 时 disable |
| 无障碍裁剪 | 仅当 INPUTS §14 勾裁剪并在 `11` 写理由 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| UiState.loading | 进度/骨架可见；无假数据当 success |
| UiState.empty | empty 帧；非 error |
| UiState.error | 错误文案 + Retry（若矩阵要求） |
| 点击 Retry | 发出对应 Event（RNTL） |
| 详情 404 | not-found 帧；非 empty |
