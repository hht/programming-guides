# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：随宿主应用册 Language Gate（本册不另开语言百科；实现语言的 fmt/lint 跟宿主 `commands`）。

## 品类

设计决策可交付：一屏一主任务、状态矩阵、a11y 门闸；无矩阵的「好看图」不算完成。

## 核心正确性路径（全文唯一）

**Design Decision Lifecycle**：见 [06](./06-design-decision-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 一屏一主任务 / 主 CTA | `05`/评审 |
| F02 | MUST | 交互态按矩阵列交付 | matrices |
| F03 | MUST | 系统控件/已有 DS 优先 | `01` |
| F04 | MUST | a11y 非可选（对比度/焦点/触控等） | `08`/`11` |
| F05 | MUST NOT | 无矩阵与命名的好看图当完成 | `11` |
| F06 | MUST | Token 写 SSOT=`design/tokens.md`；Variables 同名镜像 | design-tokens |
| F07 | MUST | deletion-first；无 INPUTS 的屏/组件不做 | INPUTS |

## SSOT

| 真相 | Owner |
|------|--------|
| 用户任务与成功标准 | INPUTS §1 |
| 平台行为 | INPUTS §2 + `08` |
| Token | `design/tokens.md`（工程 Apply 见 design-tokens） |
| 组件状态 | `design/matrices/<screen-id>.md` |
| 文案 | INPUTS §4 |
| join key | `02` 的 screen-id |

## 超越

1. `对照：B 中更弱/未见「每交互组件强制状态矩阵交付」硬门闸 → 本指南要求`
2. `对照：B 中更弱/未见「WCAG 2.2 AA 作为设计完成门闸」硬门闸 → 本指南要求`
