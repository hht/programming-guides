# 03 — App Router 与布局

## 不变量

- 文件约定路由；`layout.tsx` 嵌套；`loading.tsx`/`error.tsx` 按段提供  
- 根 layout 含 `html`/`body`；字体与主题一次性注入  

## 步骤

1. 按 INPUTS §2 建 segment。  
2. 共享壳放 `(app)/layout.tsx`；营销可 `(marketing)`。  
3. 每主路径段：`loading.tsx` + `error.tsx`（或上浮到父级并注明）。  
4. 元数据：`export const metadata` 或 `generateMetadata`。  

## 失败

| 情况 | 行为 |
|------|------|
| 客户端整树 `"use client"` | 退回；只包交互叶 |

## 探针

| case | 期望 |
|------|------|
| 无 JS | 主内容仍可读（RSC） |
