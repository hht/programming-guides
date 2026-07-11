# 07 — 超预算减配

## 不变量

- `OVER_BUDGET` **必须**走本阶梯；禁止加更重动画库「提速」。 
- 每降一档须**重新测量**（回 `05` 步骤 4）。 
- 减配后 `status=degraded`；仍须满足该档数字预算。

## 减配阶梯（写明顺序）

| 阶 | 动作 | 预算影响 |
|----|------|----------|
| 1 | 去掉 `filter` / 复杂 `clip-path`；改为 `opacity`/`transform` | 降 GPU/paint |
| 2 | 缩短时长至 `04` Micro 档；减缓动复杂度（弹簧→CSS ease） | 降重叠帧压力 |
| 3 | 取消交错/交错子元素；单元素一次运动 | 降主线程与 layer 数 |
| 4 | 降到 **30 fps 档**（`frame_budget_ms=33.33`）或降低动画频率 | 明确降档 |
| 5 | **关闭动效**（瞬时状态切换）；保留可用性 | 最终兜底 |

`prefers-reduced-motion: reduce` → 直接阶 5（或等价瞬时），除非 INPUTS §13 明示不降级（仍须测量且不豁免白名单）。

## 步骤规格（实现自写）

1. 记录 OVER_BUDGET 证据到 registry `notes`。 
2. 从阶 1 起应用；每阶后测量。 
3. 通过则停止并标 `degraded` + 所用阶号。 
4. 阶 5 仍「失败」仅当关闭后**布局/可用性**损坏 — 那是 UI 问题，交 ui-ux，不是再加动画。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 跳阶直接上 Lottie「优化」 | 禁止；LIBRARY_DEFAULT_VIOLATION 风险 |
| 减配后未重测 | MEASURE_MISSING |
| 用户要「必须原样炫技」 | 拒合并；或扩设备档 + 120/专项预算须写明 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| OVER_BUDGET 后 status 仍 pass 无 degrade | 非法 |
| 阶 1 后重测 pass | status=degraded 合法 |
| reduced-motion | 无持续动画或时长≈0 |
