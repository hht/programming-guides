# 04 — 帧预算数字

## 不变量

- **无数字不成关键动效**：每条关键 Motion 必须有 `target_fps` 与 `frame_budget_ms`。 
- 默认主档 **60 fps → 16.67 ms/帧**。 
- 主线程 JS/脚本工作默认份额：**≤ 8 ms**（留给样式/合成/系统；对齐「一帧内可完成」工程实践）；其余为合成/GPU。INPUTS 可收紧，不可无理由放宽到 ≥16 ms 却仍声称 60 fps。

## 默认数字表（改则写 INPUTS）

| 档 | `target_fps` | `frame_budget_ms` | `main_thread_budget_ms` | 何时用 |
|----|--------------|-------------------|-------------------------|--------|
| Full | 60 | **16.67** | **8** | 默认交付 |
| High refresh | 120 | **8.33** | **4** | 仅 INPUTS 声明高刷设备档 |
| Degraded | 30 | **33.33** | **12** | 仅 `07` 减配后；不得作未测前主档 |

## 时长与缓动默认（非关键可复用）

| 类型 | 时长 ms | 缓动 |
|------|---------|------|
| Micro（按钮/图标） | 120–200 | `ease` / `cubic-bezier(0.22, 1, 0.36, 1)` |
| Surface（卡片/面板） | 200–320 | 同上 |
| Page / reveal | 320–480 | 同上；更长须拆阶段并分别登记预算 |
| 弹簧（若学 react-spring 边界后选用） | 须登记结算时间上限 ms | **非默认**；Web 默认 CSS |

## 登记形状

对齐 [templates/frame-budget.schema.json](./templates/frame-budget.schema.json)。每条至少：

```text
id, surface, target_fps, frame_budget_ms, main_thread_budget_ms,
properties[], duration_ms, measure_tool, status (pass|over_budget|degraded)
```

人类可读总表：[templates/motion-registry.example.md](./templates/motion-registry.example.md)。

## 步骤规格（实现自写）

1. INPUTS §2 选定主档 fps → 填入所有关键行的 `target_fps` / `frame_budget_ms`。 
2. 每条关键动效写 `main_thread_budget_ms`（默认 8 @60）。 
3. `filter`/`clip-path` 复杂项：在同行加 `notes` 标明额外 GPU 风险。 
4. 发版前 `status` 必须为 `pass` 或已 `degraded` 且减配档预算通过。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 缺 `frame_budget_ms` | 阻塞；视同未完成 |
| 声称 60 fps 但 main_thread 预算 ≥16 | 非法；改数字或降档 |
| 装饰动效无登记 | 允许但不进关键；一挤占关键则必须登记 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 60 fps 行 budget=16.67 | schema valid |
| 关键行无 frame_budget_ms | invalid |
| degraded 行 fps=30 budget=33.33 | valid |
