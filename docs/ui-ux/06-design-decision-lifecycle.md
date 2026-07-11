# 06 — Design Decision Lifecycle（核心正确性路径）

## 不变量

全文唯一主路径：`钉任务 → IA → 布局 → 状态矩阵 → a11y → Figma 交付 → 实现对照`。

超越：

1. `对照：B 中更弱/未见「每交互组件强制状态矩阵交付」硬门闸 → 本指南要求；矩阵列与 templates/state-matrix.md 八列对齐`  
2. `对照：B 中更弱/未见「WCAG 2.2 AA 作为设计完成门闸」硬门闸 → 本指南要求`

## 步骤规格（钉死顺序）

1. **钉任务**：复述 INPUTS §1；写「非目标」≤3 条 → `design/flows/<task-id>.md` 开头。  
2. **IA**：按 `03`；屏幕清单写入 INPUTS §3b 与 `design/screens/<screen-id>.md`。  
3. **布局**：按 `04`；Figma 灰框 Frame 名用 `02` join key。  
4. **状态矩阵**：按 `05`；列集合 = templates 八态（不适用填 `N/A`）；文件 `design/matrices/<screen-id>.md`。  
5. **a11y**：按 `07` 十项全勾；写入 `design/figma-notes.md`：`a11y: PASS` + 对比抽检说明。  
6. **Figma**：按 `08`。  
7. **实现对照**：复制 [templates/handoff.md](./templates/handoff.md) → `design/handoff.md` 填完；状态列须覆盖矩阵中非 N/A 态（勿写「四态」缩略除非仅四态适用）。  

## 失败分类

| 情况 | 行为 |
|------|------|
| 任务漂移 | 停；改 INPUTS |
| a11y 失败 | 阻塞 |
| 无矩阵 / handoff 空 | 阻塞 |

## 探针

| case | 期望 |
|------|------|
| 只读 handoff.md | 实现 agent 能列出组件×状态×token |
| 任一 screen-id | flows/screens/matrices/Figma 同名可连 |
