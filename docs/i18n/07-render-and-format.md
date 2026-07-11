# 07 — Render and Format

## 不变量

- 渲染入口唯一：库提供的 `t` / `useTranslations` / `<FormattedMessage>` / 服务端等价；禁止 `messages[key]` 散落业务且绕过 `onError`。 
- 插值/复数/选择 = **ICU**；数字日期 = **`Intl` + resolvedLocale`**（或 ICU 内 number/date 元素）。 
- 用户可见输出不得包含未翻译 key 路径（缺 key 走 `08`）。

## 步骤规格（实现自写）

1. **取消息**：`formatMessage({ id: key }, values)` 或 `t(key, values)`。 
2. **传参**：仅传 ICU 声明的变量；多余变量可忽略；**缺必填变量 → fail**（同缺 key 等级）。 
3. **数字**：`new Intl.NumberFormat(locale, options).format(n)`；货币码来自业务，不硬编码符号进消息（消息可含 `{amount}` 已格式化串）。 
4. **日期时间**：`Intl.DateTimeFormat(locale, { timeZone })`；`timeZone` 来自 INPUTS §8。 
5. **富文本**：若需链接/加粗，用库的 rich text / `t.rich`（next-intl）或 `FormattedMessage` values 中的 element；**禁止** `dangerouslySetInnerHTML` 未消毒翻译串。 
6. **列表/枚举**：`Intl.ListFormat` 或 ICU select。 
7. **无障碍**：`lang` / `dir` 属性随 `resolvedLocale` 更新（RTL 若 INPUTS §13）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 缺 key / 坏 ICU 运行时 | `08` fail |
| 错误 locale 的 NumberFormat | 禁止；必须用 resolvedLocale |
| 翻译串含原始 HTML 脚本 | 拒绝或消毒；默认 **不**渲染 HTML（仅 rich API 白名单标签） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| `Hello, {name}` + name=Ada | `Hello, Ada` |
| plural 0/1/2 | 符合 locale 复数规则 |
| number 格式 en vs de | 分组符不同 |
| 缺 values 必填 | fail |
| raw key 显示 | 禁止（prod/dev 策略下均不可当成功） |
