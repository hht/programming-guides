# 04 — TUI 渲染与输入

## 不变量

- 所有可见文本在 `<Text>`（或 `@inkjs/ui` 封装）内；布局用 `<Box>` Flexbox 
- 键盘处理用 Ink `useInput` / 组件自带 input；禁止同时挂两套全局 key 监听抢键 
- 焦点：多可交互区用 `useFocus` / `useFocusManager`；同时仅一处聚焦 
- 组件卸载时释放 raw mode（依赖 Ink `useApp().exit` / unmount，勿泄漏）

## 步骤规格

1. 命令组件顶层按 INPUTS 线框拆 `ui/` 区块（Header / Body / Footer 或等价）。 
2. 列表/选择：优先 `@inkjs/ui` 的 Select；输入：TextInput 类组件（生态或自写）。 
3. 加载态：Spinner + 短状态文案；禁止无反馈的长 await。 
4. 错误态：在 TUI 内展示可行动信息；先设 `process.exitCode`，再 `useApp().exit()`（完整顺序见 `05`）；**禁止**在挂载中调用 `process.exit()`。 
5. 颜色：用 Ink `<Text color>` / 语义色；尊重 `NO_COLOR`（检测后无色）。**禁止**再声明独立 `chalk` 依赖。 
6. 宽字符/截断：长行用 Ink 布局或 `cli-truncate` 思维；关键列勿依赖「刚好 80 列」。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 非 TTY 却进入全屏 TUI | 禁止；改走 `06` 非交互或 exit 校验失败码 |
| 未处理按键 | 忽略或 Footer 提示快捷键；勿崩溃 |
| 渲染抛错 | 边界捕获 → stderr 栈（dev）/ 短消息（prod）→ exit 1 |

## 单测探针

| case | 期望 |
|------|------|
| 初始帧 | `lastFrame()` 含主标题/关键控件文案 |
| 模拟按键后 | 帧内容按状态机变化 |
| unmount | 无未处理 rejection |
