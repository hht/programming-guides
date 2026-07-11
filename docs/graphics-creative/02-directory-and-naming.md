# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

## 树（钉死词根；路径可按应用册微调，**词根不可改**）

```text
<repo>/
  UBIQUITOUS_LANGUAGE.md
  # Web 例：
  src/
    motion/                      # 或 features/<surface>/motion/
      registry.md                # 关键动效登记（对齐 templates/motion-registry）
      frame-budgets.json         # 对齐 templates/frame-budget.schema.json
      # 禁：animationManager/、handleAnimate.ts、dto/
  # 样式：与应用册一致（CSS / Tailwind）；动画 class 用业务名词根
  # 原生：见 apple-platforms / android-compose；仍保留 registry + budgets 语义文件
```

## 依赖方向

```text
产品 UI / 路由
    → Motion Registry（哪些表面有关键动效）
    → Property Whitelist（03）
    → Frame Budget（04）
    → Frame Budget Lifecycle（05）：measure → pass | degrade（07）
测量工具（06）只读产出证据；禁止业务绕过 Lifecycle 直接「加库提速」
```

禁止：业务组件内散落无登记关键动效；测量未做却标「已优化」。

## UI 状态落点（动效相关）

| 状态 | 含义 | 落点 |
|------|------|------|
| `idle` | 无进行中关键动效 | 默认态 |
| `enter` | 进场 / 揭示 | 登记表 `trigger=enter` |
| `exit` | 退场 | 登记表；可与路由卸载对齐 |
| `over-budget` | 测量失败 | 减配档 UI（弱化或关）；见 `07` |
| `reduced-motion` | 系统偏好减动效 | 瞬时或关；INPUTS §13 |

## Pass 1 — 业务语义（必做）

目标仓建立 `UBIQUITOUS_LANGUAGE.md`，至少收录：

| Term | 含义 | 代码符号 | 禁同义词 |
|------|------|----------|----------|
| Frame Budget | 单帧时间上限（ms） | `FrameBudget` / `frame_budget_ms` | `PerfLimit` 分叉 |
| Target Fps | 目标帧率 | `TargetFps` / `target_fps` | `refreshRate` 混用未钉 |
| Motion | 一条用户可感知动效 | `Motion` | `Anim`/`Fx` 无词表并行 |
| Property Whitelist | 允许动画的属性集 | `PropertyWhitelist` | `AnimatableProps` 若未收录 |
| Frame Budget Lifecycle | 目标→白名单→测→减配 | `FrameBudgetLifecycle` | `PerfPipeline`、`handlePerf` |
| Degrade | 超预算减配 | `Degrade` / `degrade` | `fallbackAnimation` 未收录 |
| Jank | 掉帧/卡顿（可测） | `Jank` | 口语「卡」不进代码名 |
| Motion Registry | 关键动效清单 | `MotionRegistry` | `AnimationCatalog` 分叉 |
| OVER_BUDGET | 超帧预算 | `OVER_BUDGET` | `PERF_FAIL_1` |
| WHITELIST_VIOLATION | 动画了禁属性 | `WHITELIST_VIOLATION` | — |

**禁**：`*Dto`、`*Manager`、`*Service`、`handle*`、`process*`、`AnimationHelper` 进领域主名。

| 概念 | 正例 | 反例 |
|------|------|------|
| 模块 | `motion/`、`frame-budgets.json` | `animationManager/`、`gfxService/` |
| 函数 | `assertFrameBudget`、`degradeMotion` | `handleAnimate`、`processFrames` |
| 错误 | `OVER_BUDGET`、`WHITELIST_VIOLATION` | `ERR_GFX_1` |

## Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| TS | 类型 Pascal；函数 camel；文件 kebab 或与仓一致 |
| CSS class | 业务词根 + 状态：`hero-enter`；禁无意义 `anim1` |
| JSON 字段 | snake_case：`frame_budget_ms`、`target_fps` |
| 错误码 | `SCREAMING_SNAKE` 与词表一致 |
| Swift / Kotlin | 跟原生册；词根仍用 Pass1 英词 |
