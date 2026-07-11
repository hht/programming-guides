# 00 — 原则与不变量

## 品类

用户以某一 locale 打开应用，系统解析 locale、加载对应消息目录，并以 ICU 规则渲染全部用户可见文案；缺翻译或硬编码串不得充当「看起来正常」的成功路径。

## 核心正确性路径（全文唯一）

**Locale Resolve Lifecycle**：**detect locale → load messages → render / missing-key fail**。规格见 [05](./05-locale-resolve-lifecycle.md)。检测见 `04`；加载见 `06`；渲染见 `07`；缺 key / 硬编码门禁见 `08`——**不替代**本路径名。

## 硬不变量

1. **文案 SSOT**：生产用户可见文案来自 **JSON + ICU MessageFormat** 目录（`03`）；禁止组件/页面内硬编码用户可见串作唯一源。 
2. **运行时按宿主互斥**：Next → `next-intl`；Vite SPA → `react-intl`；禁止同仓双 i18n 运行时 SSOT；禁止未声明就把 i18next 当默认。 
3. **Locale Resolve Lifecycle 顺序固定**：先 detect，再 load，再 render；不可在未解析 locale 时用默认目录冒充「已检测」。 
4. **missing-key fail**：缺 key 不是成功渲染；dev 抛错、CI 红灯、prod 按 `08` fail-loud（默认）；禁止无日志静默显示 key 名或默默改用另一 locale 当唯一策略。 
5. **同一 key 跨断点**：PC/H5（或宽窄布局）共用 key；禁止为 H5 新增同义文案 key。 
6. **ICU 为插值/复数/选择唯一方言**（目录内）；禁止自造 `{{name}}` 与 ICU 并行第二套占位语法作 SSOT。 
7. **错误码 → 文案 key** 有对照表；禁止把 raw 后端英文/堆栈直接给用户。 
8. **deletion-first**：无平行第二套「翻译产品」目录格式；无 `*I18nManager` / `*LocaleService` 领域主名（见 `02`）。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 宿主 / locale 列表 / 默认 locale / 缺 key 策略 | `INPUTS.md` |
| 消息文件形状与 key 约定 | `03-messages-ssot.md` + templates |
| 检测序 | `04-detect-locale.md` |
| Lifecycle 步骤 | `05-locale-resolve-lifecycle.md` |
| 加载与分片 | `06-load-messages.md` |
| ICU 渲染与 `Intl` 格式化 | `07-render-and-format.md` |
| 缺 key fail + 硬编码门禁 | `08-missing-key-and-hardcode-gate.md` |
| 应用路由/页面 | [react](../react/README.md) / [nextjs](../nextjs/README.md) |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止

- 指南仓堆可运行业务页面 / 真翻译平台密钥 
- i18next（或其它库）与 FormatJS 系双默认开口 
- 静默缺 key、硬编码用户可见串 
- 用「先只写英文再提取」作为生产无门禁路径 
- 以翻译 SaaS 控制台当唯一文案真相且仓库无 JSON SSOT 

## 超越（对照写入 11）

1. `对照：B 中常见缺 key 回退显示 key 名或静默 fallback 默认 locale → 本指南要求 missing-key fail（dev 抛错 + CI 红灯 + prod fail-loud），并有探针（见 08/09）` 
2. `对照：B 中示例常在 JSX 内硬编码英文 → 本指南要求用户可见串经消息 key，硬编码 lint/门禁红灯（见 03/08）` 
