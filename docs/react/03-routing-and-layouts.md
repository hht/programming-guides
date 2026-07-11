# 03 — 路由与布局

## 不变量

- 唯一路由 SSOT：`src/routes/` + 生成的 `routeTree.gen.ts` 
- 需登录路由在 `beforeLoad` 检查会话；未登录 → `redirect({ to: '/login' })` 
- 布局用 pathless layout route（`_app` 等）；营销/登录与 app 壳分离 

## 步骤规格

1. Vite 配 `@tanstack/router-plugin`；`main.tsx` 挂 `RouterProvider`。 
2. `__root.tsx`：全局 `QueryClientProvider`、shadcn `Toaster`（sonner）、错误边界。 
3. 按 INPUTS 路由表建文件；search/params 用 Zod + TanStack `validateSearch`。 
4. 404：`notFoundComponent`；错误：`errorComponent`。 
5. 深链：刷新后同 URL 可恢复（依赖 loader/query，不靠仅内存）。 

## 失败分类

| 情况 | 行为 |
|------|------|
| 未登录进受保护路由 | redirect login，保留 `redirect` search |
| validateSearch 失败 | 路由级错误 UI；不渲染脏页 |
| beforeLoad 抛 401 | 清会话 → login |

## 单测探针

| case | 期望 |
|------|------|
| 非法 search | 进入 error/notFound 路径，不白屏 |
| 未登录访问 _app 子路由 | 导航到 login |
