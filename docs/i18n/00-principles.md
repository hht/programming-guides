# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：宿主多为 TypeScript → 跟 [typescript Language Gate](../meta/language-gates/typescript.md)；本册不复制语言硬门闸。

## 品类

用户以某一 locale 打开应用：解析 locale、加载消息目录、ICU 渲染；缺翻译不得冒充成功。

## 核心正确性路径（全文唯一）

**Locale Resolve Lifecycle**：detect → load messages → render / missing-key fail。规格见 [05](./05-locale-resolve-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 生产文案 SSOT=JSON+ICU 目录 | `03` |
| F02 | MUST NOT | 组件内硬编码用户可见串作唯一源 | `08`/CI |
| F03 | MUST | 运行时按宿主互斥（Next=next-intl；Vite=react-intl） | `01` |
| F04 | MUST NOT | 同仓双 i18n 运行时 SSOT；未声明默认 i18next | 同上 |
| F05 | MUST | 先 detect 再 load 再 render | `05` |
| F06 | MUST | missing-key fail（dev 抛错/CI 红/prod fail-loud） | `08` |
| F07 | MUST NOT | 静默显示 key 名或默默换 locale 当唯一策略 | 同上 |
| F08 | MUST | 同 key 跨断点；ICU 唯一方言 | `03`/`07` |
| F09 | MUST | 错误码→文案 key 对照；禁 raw 堆栈给用户 | `08` |
| F10 | MUST | deletion-first | 目录 |

## SSOT

| 真相 | Owner |
|------|--------|
| 宿主 / locale 列表 / 缺 key 策略 | `INPUTS.md` |
| 消息文件形状 | `03` + templates |
| 检测序 | `04` |
| Lifecycle | `05` |
| 加载 | `06` |
| ICU 渲染 | `07` |
| 缺 key / 硬编码门禁 | `08` |
| 应用路由 | [react](../react/README.md) / [nextjs](../nextjs/README.md) |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md` |
