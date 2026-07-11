# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：随宿主应用册 Language Gate（本册不另开语言百科；实现语言的 fmt/lint 跟宿主 `commands`）。

## 品类

颜色/字阶/间距等约定成单一源 token，经可重复变换进入 UI；组件只消费语义名。

## 核心正确性路径（全文唯一）

**Token Apply Lifecycle**：source tokens → transform → consume in UI。规格见 [05](./05-token-apply-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 源格式唯一：W3C DTCG | `04` |
| F02 | MUST | 变换唯一：Style Dictionary | `06` |
| F03 | MUST NOT | 第二套色名/正式路径并存 legacy 平行源 | `03` |
| F04 | MUST | 分层 primitive→semantic→component；UI 默认只绑 semantic | `07` |
| F05 | MUST | 设计/工程同名 join key（tokens.md ↔ Variables） | `08`+ui-ux |
| F06 | MUST NOT | 组件/CSS/className 发明新颜色真相 | `07` |
| F07 | MUST | deletion-first；迁移删第二套色 utility | 目录 |
| F08 | MUST NOT | 指南仓堆可运行完整 DS 实现 | 边界 |

## SSOT

| 真相 | Owner |
|------|--------|
| 源格式 / 变换 / 输出平台 / 色名词表 | `INPUTS.md` |
| 色名与分层 | `03` |
| 源细节 | `04` |
| Lifecycle | `05` |
| 变换 | `06` |
| 消费 | `07` |
| 对位 ui-ux | `08` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md` |
