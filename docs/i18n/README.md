# i18n — 文案 SSOT·Locale 流水线指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **locale 解析与文案渲染**：检测 locale → 加载消息目录 → 渲染；缺 key **失败**（非静默）。  
> **默认栈**：**文案 SSOT = JSON + ICU MessageFormat**；运行时按宿主互斥钉死——**Next.js App Router → `next-intl`**；**Vite SPA（react 册）→ `react-intl`（FormatJS）**。学边界于 formatjs / i18next / next-intl（见 [sources.md](./sources.md)）；**禁止**把 i18next 钉为默认；**禁止**组件内硬编码用户可见串作生产唯一源。  
> **对齐**：[react](../react/README.md) · [nextjs](../nextjs/README.md)（本册为 Locale Resolve Lifecycle SSOT；应用册 INPUTS 的 i18n 勾选指向本册）。  
> **来源**：[sources.md](./sources.md)

## 品类一句话

用户以某一 locale 打开应用，系统解析 locale、加载对应消息目录，并以 ICU 规则渲染全部用户可见文案；缺翻译或硬编码串不得充当「看起来正常」的成功路径。

## 核心正确性路径

**Locale Resolve Lifecycle**（[05](./05-locale-resolve-lifecycle.md)）：

`detect locale → load messages → render / missing-key fail`（编号步骤）。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；宿主（Next / Vite SPA）与 locale 列表已互斥钉死  
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`）  
3. 必读 [03](./03-messages-ssot.md) + [04](./04-detect-locale.md) + [05](./05-locale-resolve-lifecycle.md)  
4. 落地 [06](./06-load-messages.md) / [07](./07-render-and-format.md) / [08](./08-missing-key-and-hardcode-gate.md)  
5. 若对接 [react](../react/README.md) / [nextjs](../nextjs/README.md)：应用册保留路由/页面 SSOT；**文案与 Lifecycle 以本册为准**  
6. [commands.md](./commands.md) `check` 绿  
7. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者）  

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；宿主 / locale 列表 / 缺 key 策略 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-messages-ssot.md) | 文案 JSON/ICU SSOT |
| [04](./04-detect-locale.md) | locale 检测序 |
| [05](./05-locale-resolve-lifecycle.md) | **Locale Resolve Lifecycle（核心）** |
| [06](./06-load-messages.md) | 消息加载与分片 |
| [07](./07-render-and-format.md) | ICU 渲染与格式化 |
| [08](./08-missing-key-and-hardcode-gate.md) | 缺 key fail + 禁硬编码门禁 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | schema / env / 矩阵例 |
