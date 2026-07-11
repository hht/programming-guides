# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：宿主多为 TypeScript → [typescript Language Gate](../meta/language-gates/typescript.md)；本册不复制语言硬门闸。

## 品类

为产品 UI 交付可预算的动效与渲染性能；掉帧可测；禁无预算炫技。

## 核心正确性路径（全文唯一）

**Frame Budget Lifecycle**：目标 fps → 属性白名单 → 测量 → 超预算减配。规格见 [05](./05-frame-budget-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | Web 只动画 transform/opacity/filter/clip-path（平台等价见 08） | `03` |
| F02 | MUST | 关键动效有 target_fps + frame_budget_ms | `04`/registry |
| F03 | MUST NOT | Framer Motion/GSAP/Lottie 作默认依赖 | `01` |
| F04 | MUST | 掉帧可测；有测量证据 | `06` |
| F05 | MUST | 超预算必须减配 | `07` |
| F06 | MUST | 本册为动效/帧预算 SSOT | 边界 |

## SSOT

| 真相 | Owner |
|------|--------|
| 目标 fps / 平台 / 关键动效清单 | `INPUTS.md` |
| 属性白名单 | `03` |
| 默认预算数字 | `04` |
| Lifecycle | `05` |
| 测量 | `06` |
| 减配 | `07` |
| 登记表 | templates + motion registry |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md` |
