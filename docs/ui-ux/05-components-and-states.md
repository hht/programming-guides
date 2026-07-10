# 05 — 组件与状态

## 不变量

- 每个可交互组件有状态矩阵行  
- 加载不导致布局剧烈跳动（预留骨架/固定高）  
- 错误可恢复：说明原因 + 下一步  

## 必做状态（适用则填；列集合钉死）

| 状态 | 含义 |
|------|------|
| default | 静止可点 |
| hover | 仅指针设备；触控可 N/A |
| pressed | 按下（含 active；矩阵列名固定 `pressed`） |
| focus | 键盘/焦点环可见 |
| disabled | 不可点；对比可降但须可辨 |
| loading | 进行中；防重复提交 |
| empty | 无数据 |
| error | 失败 |

不适用列填 `N/A`（禁止留空）。

## 步骤规格

1. 按屏列出组件清单。  
2. 填矩阵（列与 [templates/state-matrix.md](./templates/state-matrix.md) 一致）；路径 `design/matrices/<screen-id>.md`。  
3. 破坏性按钮：用危险色；与主 CTA 分离。  
4. Toast/Banner：短、可关闭或超时；**不**作为唯一错误通道（表单错误须贴字段）。  

## 探针

| case | 期望 |
|------|------|
| 矩阵每行 | 有视觉或说明；非 N/A 列无空 |
| 双击提交 | loading 防重 |
