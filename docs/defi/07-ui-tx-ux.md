# 07 — UI / 交易 UX（规格）

- 视觉 SSOT = **设计稿**；本指南不管像素实现细节  
- 交互/状态 SSOT = [page-state-matrix.md](./templates/page-state-matrix.md)  
- 用户可见文案走 i18n；PC 文案 SSOT，H5 不另造同义 key  
- 交易 UI 状态机：`idle → validating → awaiting_signature → submitted → confirming → success|failed|unknown`；`rejected` 回 idle  
- **success 仅在 receipt 成功之后**  
- 无限授权、spender、金额在应用内二次展示  

Agent 按 Figma frame 实现组件；不要在本指南仓库实现 UI 库。
