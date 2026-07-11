# 00 — 原则与不变量

## 品类

为产品 UI 交付**可预算**的动效与渲染性能；掉帧可测；禁无预算炫技。

## 核心正确性路径（全文唯一）

**Frame Budget Lifecycle**：目标 fps → 动画属性白名单 → 测量 → 超预算则减配。规格见 [05](./05-frame-budget-lifecycle.md)。

## 硬不变量

1. **只动画白名单属性（Web）**：`transform` / `opacity` / `filter` / `clip-path`；平台等价见 [08](./08-native-optional.md)。  
2. **每条关键动效必须有帧预算数字**：`target_fps` + `frame_budget_ms`（及主线程份额）；无数字 = 未完成。  
3. **默认栈禁炫技库**：Web **禁止** Framer Motion / GSAP / Lottie 作默认依赖（可学边界，不可钉默认）。  
4. **掉帧可测**：发版前用 [06](./06-measurement.md) 工具对关键路径出证据；禁止「感觉流畅」代替测量。  
5. **超预算必须减配**：走 [07](./07-degrade-and-tier.md)；禁止用更重库「盖住」掉帧。  
6. **本册 = 动效/帧预算 SSOT**：应用册（react/nextjs/…）引用本册，不平行发明第二套属性白名单或 fps 语义。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 目标 fps / 平台 / 关键动效清单 | `INPUTS.md` |
| 属性白名单 | `03-property-whitelist.md` |
| 默认预算数字 | `04-frame-budget-numbers.md` |
| Frame Budget Lifecycle 步骤与失败类 | `05-frame-budget-lifecycle.md` |
| 测量工具与通过谓词 | `06-measurement.md` |
| 减配阶梯 | `07-degrade-and-tier.md` |
| 登记表形状 | `templates/frame-budget.schema.json` + motion registry |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止

- 指南仓堆可运行完整动效 demo / 游戏引擎  
- 无预算的「先炫再优化」默认路径  
- 用 `top`/`left`/`width`/`height` 做关键路径默认动画  
- 把 react-spring / Motion 钉为默认依赖（可学，非默认）  
- 运维 APM（Sentry 等）进本册必勾  
