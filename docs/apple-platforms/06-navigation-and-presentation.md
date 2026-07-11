# 06 — 导航与呈现

## 不变量

- 默认 **NavigationStack** + 类型化 `Route`（`Hashable`）；path 为导航 SSOT。  
- Sheet / fullScreenCover / alert 的呈现状态进 Store 或显式 `@State`，禁「幽灵」多 sheet 无来源。  
- 深链（若 INPUTS 有）解析为 `Route`，再写入 path；禁另写一套 URL→UIKit 跳转。

## 步骤规格（实现自写）

1. **定义 `Route`**：枚举关联值携带业务 id（词表实体名）；禁 `AnyView` 擦除路由表。  
2. **根栈**：`NavigationStack(path: $store.path)` + `navigationDestination(for: Route.self)`。  
3. **Tab**：每 Tab **独立** `NavigationStack`（若 INPUTS §10 选 Tab）；跨 Tab 跳转经显式 intent。  
4. **返回**：pop 只改 path；业务「保存后返回」须先完成 View-State 写路径再 pop（对齐 `05` 成功态）。  
5. **呈现**：`sheet(item:)` 用 Identifiable 模型；关闭 = 清 item。  
6. **iPad**：若目标含 iPad，列 `NavigationSplitView` 是否使用（INPUTS 可扩）；默认 phone-first + 可读 split。  
7. **Mac**：窗口与多栏见 `08`；导航类型仍复用同一 `Route`。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 深链实体不存在 | `NOT_FOUND` 屏；不清整个 path 致白屏 |
| 未登录深链 | 先登录再恢复 `Route`（可选；INPUTS 钉） |
| 重复 push 同 Route | 按 **INPUTS §10b**（默认允许栈内重复；若勾「去重」则执行书面谓词） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| send navigate(detail) | path 末元素 = 对应 Route |
| pop | path 减少 1 |
| 深链解析（若有） | URL → Route 单测表 |
