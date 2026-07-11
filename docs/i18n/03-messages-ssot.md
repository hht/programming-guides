# 03 — 文案 Messages SSOT

## 不变量

- 生产用户可见文案 **唯一源** = 仓库内 **JSON + ICU MessageFormat** 目录（路径见 INPUTS）。 
- 禁止 JSX/TSX/Swift 等业务文件硬编码用户可见句子作生产唯一源（例外白名单见 INPUTS §6）。 
- 禁止平行第二套目录格式（YAML / TS `as const` 英文表 / CMS 仅云端）取代仓库 JSON SSOT。 
- PC 与 H5（或其它断点）**同一 key**；禁止同义分叉 key。

## 步骤规格（实现自写）

1. **建目录**：为 INPUTS 每个 locale 建文件（或分片树）；默认 locale 文件必须存在且为 **key 超集基线**（其它 locale 的 key ⊆ 默认 locale，或 CI 要求全等——INPUTS 选定一种；**默认 = 全 locale key 集合相等**）。 
2. **写 key**：按 `02` Pass1（业务区域.动作/元素）；值为 ICU 字符串。 
3. **ICU 最小集**（必会）： 
 - 纯文本：`"Welcome"` 
 - 插值：`"Hello, {name}"` 
 - 复数：`"{count, plural, =0 {No items} one {# item} other {# items}}"` 
 - 选择：`"{gender, select, female {She} male {He} other {They}}"` 
 - 与数字/日期：优先在消息外用 `Intl` 格式化后传入，或 ICU 内 `{n, number}` / `{d, date, medium}`（见 `07`） 
4. **嵌套 JSON**：允许 `{ "swap": { "title": "…" } }`，运行时 key 为 `swap.title`（或库的 namespace 等价）；**禁止**同一语义既有扁平又有嵌套双份。 
5. **提取流程（可选）**：可用 FormatJS extract；提取结果 **仍落回** 本目录；提取不是第二 SSOT。 
6. **对接应用册**：凡用户可见标签、按钮、空态、错误提示、Toast —— 只引用 key。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| locale 文件缺失 | `i18n.messages_load_failed`；Lifecycle 停在 load |
| 某 locale 缺 key（相对默认或全等集合） | CI **失败**；运行时见 `08` |
| 非法 ICU 语法 | 构建或 CI **失败**；禁止带病上线 |
| 硬编码用户可见串 | lint/门禁 **失败**（`08`） |
| TMS 与仓库不一致 | **以仓库 JSON 为准**；导入须 PR |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 默认 locale 文件存在 | load 成功 |
| 两 locale key 集合（按 INPUTS 全等） | `check-messages` exit 0 |
| 故意删一 key | `check-messages` ≠ 0 |
| 非法 ICU | 校验 ≠ 0 |
| 组件内英文句子（非白名单） | 硬编码门禁 ≠ 0 |
