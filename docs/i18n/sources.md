# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| Unicode ICU MessageFormat / CLDR（复数、选择、数字日期） | https://unicode-org.github.io/icu/userguide/format_parse/messages/ |
| FormatJS — Message Descriptor / ICU 消息 | https://formatjs.github.io/docs/core-concepts/icu-syntax/ |
| Next.js — Internationalization（App Router routing / locale） | https://nextjs.org/docs/app/building-your-application/routing/internationalization |
| ECMA-402 `Intl`（数字/日期/相对时间；与 ICU 目录配合） | https://tc39.es/ecma402/ |

## 标杆 B（开源 P1）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [formatjs/formatjs](https://github.com/formatjs/formatjs)（含 `react-intl`） | P1 | ICU MessageFormat SSOT、descriptor、`onError`、extract/compile | 照搬旧 Pages Router 全家桶；把 Babel 插件全集当唯一流水线 | 前端以 ICU 目录渲染文案 |
| B | [i18next/i18next](https://github.com/i18next/i18next)（+ `react-i18next`） | P1 | namespace/懒加载、检测插件边界、插值与复数扩展面 | **定为默认**（缺 key 常静默回退）；把 JSON 非 ICU 方言当 SSOT | 多语运行时与加载面广 |
| C | [amannn/next-intl](https://github.com/amannn/next-intl) | P1 | App Router locale 段、RSC/CSR 消息注入、middleware 检测、ICU 消息 | 照搬某商业 CMS；把教程「宽松缺 key」当生产默认 | Next 上 locale→messages→render |

映射学习（非默认、不进共有必做裁决）：`lingui`、`typesafe-i18n`、`paraglide` — 仅对照类型生成；改选须在 INPUTS 写明且仍映射本册 Lifecycle。

## 共有能力切条（用户可感知）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 按 locale 加载并显示本地化文案 | ✓ | ✓ | ✓ | **必做** |
| 切换 / 进入另一 locale 后文案更新 | ✓ | ✓ | ✓ | **必做** |
| 带变量 / 复数 / 选择的句子可读 | ✓ | ✓ | ✓ | **必做**（ICU 为默认方言） |
| 翻译管理 SaaS / 众包平台 | 可 | 可 | 可 | **参考**（不进必勾） |
| 自动机器翻译流水线 | — | 可 | — | **可选**（须 INPUTS；非共有） |

> **共有必做**仅上表用户可感知且 ≥2 源证据的能力（加载/切换文案、可读插值句等）。 
> **缺 key fail**、禁硬编码、CI 缺 key 红灯 → 仅进差距表 / `11` §C **超越 a1/a2**，不冒充共有。 
> **禁止**把 i18next（或其它库）的静默回退 / `return key` 当作共有「失败或回退」证据。

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做 |
|------|------|------|------|------|
| Locale Resolve Lifecycle 编号步骤 | 工程正确性 | 功能 | `05` | 必做 |
| 检测 locale（URL/cookie/Accept-Language/默认） | A,C + P0 Next | 功能 | `04`/`05` | 必做 |
| 加载消息目录 | A,B,C | 功能 | `06`/`05` | 必做 |
| ICU 渲染（plural/select/number/date） | A,C + P0 | 功能 | `07`/`05` | 必做 |
| 文案 JSON/ICU SSOT | A,C | 工程 | `03` | 必做 |
| 缺 key → fail（非静默） | 超越 a1 | 工程 | `08`/`05`/`09` | 超越（指南硬） |
| 禁硬编码用户可见串 + lint | 超越 a2 | 工程 | `03`/`08`/`09` | 超越（指南硬） |
| 宿主分流：Next=`next-intl`；Vite SPA=`react-intl` | 先进优先 | 工程 | `01` | 必做 |
| i18next 作默认 | B 流行 | — | — | **否**（冲突表） |
| 翻译 SaaS | — | 参考 | — | 参考；禁当正文必装 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| i18next 下载量更大 | **不**约定默认；学加载/检测边界。默认采用 **ICU + FormatJS 系**（Next→`next-intl`；Vite SPA→`react-intl`），因与 P0 ICU 对齐且缺 key `onError` 一等公民 |
| 示例常 `return key` / 静默 fallback 到默认 locale | **本指南硬要求 missing-key fail**（dev 抛错；CI 红灯；prod 按 `08` 分类，禁止无日志静默） |
| 组件内硬编码英文「先上线」 | **禁止**作用户可见 SSOT；须进目录 |
| YAML / TS 对象 / ICU JSON 多方言并存 | **采用 JSON + ICU MessageFormat** 一种 SSOT；禁平行第二套目录格式 |
| Next 与 Vite 是否强行同一 npm 包 | **否**：同一 **消息文件形状**；运行时按宿主表互斥任选一行 |
| PC/H5 分叉同义 key | **禁止**；同一 key 跨断点（对齐应用册文案 SSOT） |
