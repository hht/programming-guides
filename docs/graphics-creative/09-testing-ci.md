# 09 — 测试与 CI

> 指南不附可运行测试源码；实现仓自写。

## 单测（case → 期望）

| case | 期望 |
|------|------|
| 关键 registry 每行有 target_fps + frame_budget_ms | schema valid |
| 属性 ⊆ 白名单 | pass |
| 属性含 layout 禁项 | WHITELIST_VIOLATION |
| 60 fps 行 budget≠16.67（且未书面改） | invalid（默认表） |
| status=pass 但 measure_tool 空 | MEASURE_MISSING |
| OVER_BUDGET 未 degrade | 非法状态机 |
| package.json 含 framer-motion 且 INPUTS 无例外 | LIBRARY_DEFAULT_VIOLATION |
| reduced-motion 介质 | 无持续关键动画（或时长 0） |
| 长列表（若有）离屏项不空转 rAF | 无可见 IO 外 rAF 泄漏（探针可手工） |

## 发版矩阵

| # | 场景 | 断言 | 适用 |
|---|------|------|------|
| 1 | 关键动效快乐路径 | 白名单属性；有预算数字；registry 齐全 | 全 |
| 2 | Performance / 平台工具测量 | 证据写入；status=pass 或 degraded | 全 |
| 3 | 故意超预算夹具（或历史超预算项） | 进入减配阶梯；禁止 Full 档发版 | 全 |
| 4 | 禁默认库 | 无 Framer/GSAP/Lottie 默认依赖（或例外已书面） | Web |
| 5 | reduced-motion / 系统减动效 | 动效关或瞬时（时长 0） | **Web+原生默认必绿**；**仅** INPUTS §13「不降级」→ N/A（仍须帧预算）。原生须接 `08` 系统 API（或等价），不得以未接入跳过 |
| 6 | 长列表滚动 | 滚动可交互；无持续掉帧尖刺超约定（有列表时） | 若适用 |
| 7 | 原生关键动画 | Instruments/GPU 证据 | 仅原生勾选 |

## CI

| 门禁 | 何时 |
|------|------|
| schema / registry 校验 | 每 PR `check` |
| 白名单 rg/lint | 每 PR |
| 矩阵必绿（与 `11`§D 同构） | **仅 Web**：行 **1–5**（行 5：仅 §13「不降级」可 N/A；6 若有长列表）。**仅原生**：行 **1–3** + **5** + **7**（行 5：仅 §13「不降级」可 N/A，须接 `08` 系统 API；6 若有长列表）。**Web+原生**：并集 |
| `check-inputs` | 每 PR |
| `check-acceptance` | 每 PR：核对 `11` **A+B+D**（**不含** C） |
