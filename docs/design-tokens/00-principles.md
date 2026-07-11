# 00 — 原则与不变量

## 品类

把设计决策中的颜色 / 字阶 / 间距 / 圆角 / 阴影约定成**单一源 token**，经可重复变换进入 UI 运行时，组件只消费语义名，禁止散落第二套色名或裸 hex。

## 核心正确性路径（全文唯一）

**Token Apply Lifecycle**：**source tokens → transform → consume in UI**。规格见 [05](./05-token-apply-lifecycle.md)。源细节见 `04`；变换见 `06`；消费见 `07`；对位 ui-ux 见 `08`——**不替代**本路径名。

## 硬不变量

1. **源格式唯一**：W3C DTCG（`$value` / `$type`）。禁止正式路径并存 legacy 平行源。 
2. **变换唯一**：Style Dictionary 为正式 transform；禁止手写复制 hex 到多处当「同步」。 
3. **色名唯一**：全文一套语义色名（SSOT 见 `03` + INPUTS §3）；**禁止第二套色名**（遗留 `ink-*` / `faint` / 口语色与语义名并存）。 
4. **分层单向**：`primitive → semantic →（可选）component`；UI **默认只绑 semantic**（或 component）；禁组件直读 primitive 除非 INPUTS 写明例外且有 lint。 
5. **设计与工程同名**：启用 ui-ux 时，写 SSOT = `design/tokens.md`（Variables 同名镜像），路径与 DTCG 语义路径 **join key 同名**。 
6. **消费不发明真相**：组件、模块 CSS、调用处 `className` **不得**成为新的颜色 SSOT。 
7. **deletion-first**：迁移期删第二套色 utility / 平行 token 文件；无 INPUTS 的 token 族不做。 
8. **指南 ≠ 项目**：本仓不堆可运行业务皮肤或完整 DS 实现。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 源格式 / 变换工具 / 输出平台 / 色名词表 | `INPUTS.md` |
| 分层与禁第二套色名规则 | `03-token-model-and-color-ssot.md` |
| DTCG 源树与 Figma 边界 | `04-source-tokens.md` |
| Lifecycle 步骤 | `05-token-apply-lifecycle.md` |
| Style Dictionary 配置与产物 | `06-transform.md` |
| UI 消费契约 | `07-consume-in-ui.md` |
| 与 ui-ux / 多平台对齐 | `08-ui-ux-and-platforms.md` + [ui-ux](../ui-ux/README.md) |
| 业务/token 词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止

- 指南仓堆完整可运行主题包当业务 
- 「先随便写 hex，以后再收 token」作为正式路径 
- 为 H5 / 深色 / 某页 **另造同义色名** 
- Tokens Studio / Theo / 自研 JSON dump 与 Style Dictionary **双正式路径** 
- 把 ui-ux 的 Design Decision Lifecycle 改名成本册路径（对位，不吞并）

## 超越（对照写入 11）

1. `对照：B 中常见「文档有 token 表，但 UI 仍可散落第二套色名/裸 hex」→ 本指南要求色名 SSOT + consume 禁令 + drift/lint 探针（见 03/07/09）` 
2. `对照：B 中常见「设计 Variables 与工程 token 路径可不一致」→ 本指南要求启用 ui-ux 时语义路径同名 join key，并有漂移检查（见 04/08）` 
