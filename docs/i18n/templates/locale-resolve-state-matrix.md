# Locale UI state matrix

> 语言切换 / 首屏 locale 解析控件（若有）最少状态。实现仓勾选。

| 状态 | 用户可见 | 允许的下一步 | 禁止 |
|------|----------|--------------|------|
| `idle` | 未开始检测（少见；启动即 detecting） | → detecting | 用未解析 locale 调 t |
| `detecting` | 可选骨架 | → loading-messages / error | 展示「已是目标语言」 |
| `loading-messages` | 骨架 / 保持旧 UI 但不标新 locale ready | → ready / error | 用新 locale 标签 + 旧文案冒充成功 |
| `ready` | 目标 locale 文案 | 切换 → detecting/loading | 缺 key 静默显示 key 路径 |
| `error` | 错误哨兵 / 重试（文案来自已有 key 或非用户路径日志） | 重试 load / 回默认 locale | 假成功 |

## 切换语言勾选

- [ ] 切换中 `loading-messages` 可感知或骨架  
- [ ] ready 后主路径文案已换  
- [ ] `document.documentElement.lang`（及 RTL `dir` 若适用）已更新  
- [ ] 缺 key 不进入 ready 假成功  
