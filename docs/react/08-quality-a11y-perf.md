# 08 — 质量、无障碍与性能

## 必做

- ESLint + `tsc -b` + Vitest 进 `pnpm check`  
- 依赖：`pnpm audit`（豁免写入 `docs/audit-exceptions.md`）  
- 生产构建：`pnpm build`；SPA fallback 由托管配置（nginx try_files / CDN）——**部署清单进 INPUTS 或 README，不绑某云**  

## 无障碍 / 性能（宜做）

默认预算（不裁则遵守；裁则在 11 写「裁剪：理由」）：

| 项 | 预算 |
|----|------|
| 路由切主内容 | 有 loading 指示，禁永久白屏 |
| 交互控件 | shadcn 默认焦点环保留；禁 `outline-none` 无替代 |
| LCP 目标 | 自订或裁剪；图片须宽高/懒加载 |

## 可观测（仅参考）

Sentry 等不进必勾；若接：过滤 ResizeObserver 噪音、挂 release。

## 单测探针

| case | 期望 |
|------|------|
| 主按钮 | 有可访问名称（Testing Library） |
