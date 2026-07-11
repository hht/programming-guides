# 09 — 测试与评审

## 「单测」= 设计评审探针

| case | 期望 | 证据 |
|------|------|------|
| 任务复述 | 与 INPUTS §1 一致 | `design/flows/` 或 handoff 首段引用 §1 |
| 每屏主 CTA | 唯一 | `03`/`matrices` 备注 `primary` 每屏恰 1 |
| 状态矩阵 | 八列不适用=N/A；无空列 | `design/matrices/<screen-id>.md` |
| a11y 表 | `07` 十项勾完 | `design/figma-notes.md` 含 `a11y: PASS` |
| Figma 命名 | 符合 `02`/`08` join key | 文件名/Frame = screen-id |
| handoff | 可映射实现 | `design/handoff.md` 行↔矩阵行 |

## 发版矩阵（设计交付；`check-release`）

| # | 场景 | 断言（可客观） | 证据路径 |
|---|------|----------------|----------|
| 1 | 主流程灰框走查 | INPUTS §1 成功标准每步有对应 screen-id | `design/flows/<flow>.md` 步骤表 |
| 2 | 主流程中保真 | 每屏备注含且仅含一个 `primary` | `design/matrices/*` |
| 3 | 错误态 | 适用屏：error 列非空 + §4 错误文案表有对应行 | 矩阵 + INPUTS §4 |
| 4 | 空态 | 适用屏：empty 列含下一步 | 矩阵 |
| 5 | a11y 抽检对比 | 正文对比记录 ≥4.5:1（或裁剪理由） | `design/figma-notes.md` |
| 6 | 实现清单 | handoff 组件/状态/token 均可映射到矩阵或 `tokens.md` | `design/handoff.md` |

## CI

设计仓无传统应用 CI；用 [commands.md](./commands.md)：PR=`check`；发版交付=`check-release`。exit 语义：清单全勾 = 0。
