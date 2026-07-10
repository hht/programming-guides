# 08 — 质量、a11y、性能

## 不变量

- `next build` 过；ESLint + tsc  
- a11y：主路径键盘可达；图片有尺寸/alt  
- 性能：LCP 预算默认 **2.5s**（实验室）；禁无故客户端大包  

## 步骤

1. 开 `typescript.strict`；禁 `any` 新增。  
2. 动态 `import()` 重 Client 岛。  
3. 图片用 `next/image`。  
4. 与 ui-ux 交接时跑对比度抽检。  

## 探针

| case | 期望 |
|------|------|
| `pnpm build` | exit 0 |
| 主 CTA | 可 Tab 到 |
