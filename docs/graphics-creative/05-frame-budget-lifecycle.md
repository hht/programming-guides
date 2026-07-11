# 05 — Frame Budget Lifecycle（核心）

> **全文唯一核心正确性路径。** 
> 目标 fps → 动画属性白名单 → 测量 → 超预算则减配。

## 不变量

- 每条**关键** Motion **只**经本生命周期；禁止「先上线再看掉帧」。 
- 失败 **fail-closed 到减配**：超预算不得以 Full 档合并；须 `degraded` 或移除动效。 
- 超越：① 只动画白名单属性；② 每条关键动效有帧预算数字；③ 超预算强制减配阶梯（见 `07`、`11`）。

## 步骤规格（编号固定）

| # | 步骤 | 规格 |
|---|------|------|
| 1 | **约定目标 fps** | 读 INPUTS §2；写入该 Motion 的 `target_fps` 与 `frame_budget_ms`（`04` 表）。未约定 → 阻塞。 |
| 2 | **属性白名单** | 属性列表 ⊆ `03`（或 `08` 等价）。违规 → `WHITELIST_VIOLATION`，改写或降级出关键路径。 |
| 3 | **实现** | Web：CSS transition/animation 或 rAF；触发可用 IO。**禁止**为通过本步引入 Framer/GSAP/Lottie 默认依赖。时长/缓动用 `04` 默认或 INPUTS。 |
| 4 | **测量** | 按 `06`：对关键路径录制 Performance / Instruments / GPU；读帧时间或掉帧证据。无证据 → 不得标 `pass`。 |
| 5 | **判定** | 帧时间 ≤ `frame_budget_ms`（或工具等价：无明显长帧/掉帧超出约定阈值）且主线程动画相关工作 ≤ `main_thread_budget_ms` → `pass`。否则 → `OVER_BUDGET`。 |
| 6 | **减配** | `OVER_BUDGET` → 执行 `07` 阶梯；重新从步骤 4 测量，直至 `pass` 或动效关闭（仍登记 `status=degraded`）。 |

可选：**进场门闸** — 步骤 3 用 IO 仅在可见时运行；不可见时禁止空转 rAF。

## 失败分类表

| 类 | 条件 | 行为 | 备注 |
|----|------|------|------|
| `BUDGET_UNSPECIFIED` | 无 fps/ms 数字 | 阻塞实现/合并 | |
| `WHITELIST_VIOLATION` | 动画禁属性 | 阻塞；改写 | |
| `OVER_BUDGET` | 测量超预算 | 强制 `07` 减配 | 禁带 Full 档发版 |
| `MEASURE_MISSING` | 无测量证据 | 阻塞发版关键行 | 禁「感觉流畅」 |
| `LIBRARY_DEFAULT_VIOLATION` | 无 INPUTS 例外却默认引入 Framer/GSAP/Lottie | 阻塞 | |
| `REDUCED_MOTION` | 系统减动效 | 瞬时/关；非失败 | INPUTS §13 |

## 伪代码（非实现）

```text
frameBudgetLifecycle(motion):
 assert motion.target_fps && motion.frame_budget_ms // else BUDGET_UNSPECIFIED
 assert motion.properties ⊆ Whitelist // else WHITELIST_VIOLATION
 implement(motion) // CSS/rAF/IO；无默认重库
 evidence = measure(motion, tool=INPUTS) // else MEASURE_MISSING
 if exceeds(evidence, motion.frame_budget_ms, motion.main_thread_budget_ms):
 motion = degrade(motion) // 07
 return frameBudgetLifecycle(motion) // re-measure
 motion.status = pass | degraded
 return allowShip(motion)
```

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 无 frame_budget_ms | BUDGET_UNSPECIFIED |
| 属性含 `width` | WHITELIST_VIOLATION |
| 测量超 16.67ms @60 | OVER_BUDGET → 进入 degrade |
| 减配后测量通过 | status=degraded 且可发版 |
| 无 Performance 证据标 pass | MEASURE_MISSING |
| 未声明例外却依赖 framer-motion | LIBRARY_DEFAULT_VIOLATION |
