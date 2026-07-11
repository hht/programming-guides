# 06 — 测量

## 不变量

- 关键路径发版前**必须有测量证据**（录屏 trace、导出摘要、或清单勾选+操作者/日期写入 registry）。  
- 工具按平台钉死默认；「其它」须 INPUTS 书面。  
- 本册**不**要求接入 Sentry/APM（运维第三方 = 参考，不进必勾）。

## Web — Chrome Performance（默认）

### 步骤规格

1. Chrome DevTools → **Performance**；开启；操作关键动效（重复 ≥3 次）。  
2. 查看 Main 线程长任务、Frames、或 Experience/帧相关指示；对照 `frame_budget_ms` / `main_thread_budget_ms`。  
3. 可选：**Rendering** → Paint flashing / FPS meter 辅助；**不得**仅用 FPS meter 无 Performance 记录作为唯一证据（易误判）。  
4. 将结论写入 registry：`measure_tool=chrome-performance`、`status`、`notes`（如「最长帧 14ms」）。

### 通过谓词（钉死）

| 档 | 通过 |
|----|------|
| 60 fps | 关键片段无明显持续 >16.67 ms 的动画相关长帧；主线程动画脚本份额目视/测量 ≤8 ms 量级；无持续掉帧尖刺 |
| 减配 30 | 按 33.33 ms 同理 |

无法自动化时：允许**人工 Performance 清单**（实现仓 `09` 发版矩阵勾选）+ registry 记录；禁止零记录。

## Apple — Instruments（SwiftUI 路径）

1. Xcode Instruments：**Time Profiler** + **Core Animation**（或当前 Xcode 等价 GPU/Core Animation 模板）。  
2. 操作关键动画；查看掉帧/提交耗时是否超出 `frame_budget_ms` 量级。  
3. 参考 P0：[Apple Energy Efficiency Guide](https://developer.apple.com/library/archive/documentation/Performance/Conceptual/power_efficiency_guidelines_osx/)（及现行 HIG/Energy 文档）— 避免无意义高刷与持续唤醒。  
4. registry：`measure_tool=instruments`。

## Android — GPU / 系统性能（Compose 路径）

1. 开启 **Profile GPU Rendering**（或 Android Studio Profiler / GPU 相关视图）。  
2. 操作关键动画；柱高相对 16 ms（60 fps）线判断。  
3. registry：`measure_tool=android-gpu`。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 无工具结果 | `MEASURE_MISSING` |
| 工具显示持续超预算 | `OVER_BUDGET` → `07` |
| 仅用「录了但没看」 | 无效；视同 MEASURE_MISSING |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| registry 关键行 measure_tool 空且 status=pass | 非法 |
| Web 关键行 tool=chrome-performance 且有 notes | 合法形态 |
| 纯 Web 仓要求 instruments | N/A（平台裁剪） |
