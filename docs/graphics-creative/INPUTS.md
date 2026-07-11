# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写动效/渲染实现**。  
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（预算数字 / 工具名 / P0 URL）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **目标平台（可多选，至少一）** | □ **Web**（默认路径） □ **iOS/macOS（SwiftUI）** □ **Android（Compose）** — 未勾选的平台，对应 `08` 行标 N/A |
| 2 | **目标 fps（互斥主档）** | □ **60**（默认；帧预算 **16.67 ms**） □ **120**（须书面设备档；帧预算 **8.33 ms**） □ **30**（仅允许作**减配档**，不得作未减配前的主档） |
| 3 | **关键动效清单** | ≥1 条用户可感知关键动效；每条含：业务名、触发（hover/enter/scroll/…）、时长 ms、属性列表、登记表路径（对齐 [templates/motion-registry.example.md](./templates/motion-registry.example.md)） |
| 4 | **属性白名单承诺** | 书面确认：关键路径**仅**动画 `transform` / `opacity` / `filter` / `clip-path`（或 `08` 平台等价）；禁 `top`/`left`/`width`/`height`/`margin` 作动画默认 |
| 5 | **帧预算登记** | 每条关键动效有数字：`target_fps`、`frame_budget_ms`、`main_thread_budget_ms`（默认见 `04`）；形状对齐 [templates/frame-budget.schema.json](./templates/frame-budget.schema.json) |
| 6 | **测量工具** | Web：□ Chrome Performance（必）± □ 其它（须名）。原生：Instruments / Android GPU 按平台勾选（见 `06`） |
| 7 | **超预算策略** | 默认走 [07](./07-degrade-and-tier.md) 减配阶梯；若书面「固定关动效」须可验收谓词 |
| 8 | **禁默认库确认** | Web：确认**不**把 Framer Motion / GSAP / Lottie 作默认依赖；若例外引入须 INPUTS 书面理由 + 仍遵守白名单与预算 |
| 9 | **列表/长滚动（若有）** | □ 无长列表 □ 有：须说明虚拟化/回收策略（学 flash-list 边界，不绑死 RN） |
| 10 | **环境成对** | staging/prod：无密钥则写 `N/A — 无动效密钥`；若有 feature flag 名则成对（值不入库） |
| 11 | **应用册对接** | □ react □ nextjs □ apple-platforms（若有）□ android-compose（若有）□ 多册（列清单）— 本册为动效/帧预算 SSOT |
| 12 | **与 ui-ux 交接** | 关键动效是否已有设计时长/缓动；无则本册用 `04` 默认时长表，并回写设计备注 |

## 若适用

| # | 项 |
|---|-----|
| 13 | `prefers-reduced-motion`：默认 **尊重**（减配到瞬时或关）；产品明示「不降级」须书面 + 仍保留帧预算测量 |
| 14 | Canvas / WebGL / 视频：须单独预算行；不得挤占关键 UI 动效的主线程预算而不登记 |
| 15 | 第三方动效组件：须过白名单 + 预算；否则禁入关键路径 |

## 平台裁剪（钉死）

| 平台勾选 | 必读章 | 可 N/A |
|----------|--------|--------|
| 仅 Web | 03–07 | 08 |
| Web + 原生 | 03–08 | — |
| 仅原生 | 03–05 原则 + 04 数字 + 06 对应工具 + 07 + 08；Web CSS 例可参考不实现 | Web 专用测量句 |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
