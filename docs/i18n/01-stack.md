# 01 — 栈

> 框架 MUST 见 [`00`](./00-principles.md)。语言硬门闸：[typescript Language Gate](../meta/language-gates/typescript.md)（宿主；不在本文件复述）。

| 层 | 选择 |
|----|------|
| **文案目录** | **JSON + ICU MessageFormat**（Unicode / FormatJS 语法） |
| **Next.js App Router（默认）** | **`next-intl`**（locale 路由 + RSC/CSR 消息；底层 ICU） |
| **Vite SPA / react 册（默认）** | **`react-intl`**（`react-intl` + `@formatjs/intl`） |
| **检测（Next）** | `next-intl` middleware / 请求 locale；对齐 Next 官方 i18n 路由概念 |
| **检测（Vite SPA）** | 显式 preference（cookie/localStorage 键名 INPUTS 约定）→ `Accept-Language` → 默认 locale |
| **格式化** | `Intl.*`（Number/DateTime/RelativeTime/List）；与当前 resolved locale 一致 |
| **映射学习（非默认）** | **i18next** / `react-i18next`：学 namespace 与检测插件；**不**替换上表。Lingui / paraglide：学类型生成，改选须 INPUTS |

禁止：留下「next-intl 或 i18next 任选」开口；同仓双运行时；非 ICU 占位符与 ICU 并行 SSOT；指南正文绑翻译 SaaS。

## 宿主 → 运行时（互斥）

实现仓按 INPUTS §1 **选定一行**；跨宿主 monorepo 可各包一行，禁止同包双库。

| 宿主 | 写明运行时 | 消息 SSOT |
|------|------------|-----------|
| Next.js App Router | `next-intl` | `messages/*.json`（ICU） |
| Vite SPA（react） | `react-intl` | 同上形状 |
| 其它 | INPUTS 写明单库 | 仍须 ICU JSON + 本册 Lifecycle |

若 INPUTS 写明改选（例 Next 改用 FormatJS 裸装），须：① 冲突表理由；② 仍映射 Lifecycle；③ **不得**与 i18next 双 SSOT。

## 脚手架

```bash
# Next.js App Router
# 1) 安装 next-intl（版本锁进应用 lockfile）
# 2) 建 messages/en.json（及 INPUTS 其它 locale）
# 3) 配置 middleware locale 前缀（默认 /{locale}/…）
# 4) 实现 Locale Resolve Lifecycle（05）

# Vite SPA
# 1) 安装 react-intl @formatjs/intl
# 2) 建 messages/en.json（同形状）
# 3) 根 IntlProvider；locale 来自 04 检测
# 4) 实现 Locale Resolve Lifecycle（05）
```

## 版本

| 项 | 策略 |
|----|------|
| `next-intl` | 跟 Next 大版本兼容的当前稳定；锁进 lockfile |
| `react-intl` / `@formatjs/*` | 同代 FormatJS；锁进 lockfile |
| Node / 浏览器 `Intl` | 以目标浏览器与 Node LTS 为基线；缺 ICU 的环境不进默认 |

## 冲突裁决（写入 sources）

- **流行度（i18next）不单独定胜负**；**ICU SSOT + 缺 key 可强制失败**优先 → 默认 FormatJS 系。 
- Next 生态以 **`next-intl`** 为 App Router 先进默认（RSC 消息、middleware）；非「下载量第一」改判。 
- Vite SPA 约定 **`react-intl`**，与 next-intl **共享消息文件形状**，避免两套目录方言。
