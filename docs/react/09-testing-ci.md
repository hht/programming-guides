# 09 — 测试与 CI

## 单测

位置：`src/**/*.test.ts(x)`（与 `02` 一致；**禁止**再建 `tests/unit`）。

e2e：`e2e/**/*.spec.ts`（Playwright 默认目录；与单元测试分离）。

| case | 期望 |
|------|------|
| zod schema | 拒非法 / 收合法 |
| query key | 稳定序列化 |
| mutation onSuccess 顺序 | mock：缓存收敛（`invalidateQueries` **或** `setQueryData`）resolve **之后**才 `navigate`（有跳转时） |
| zustand 无实体列表 | store 类型/测试断言不含 `items: Entity[]` 远程列表 |
| env parse | 缺字段失败 |
| 表单缺必填 | 无 mutation |

## 发版 e2e（Playwright）

跑法：`pnpm build && pnpm preview` 或 `vite preview` + Playwright `baseURL`。  
禁依赖真实外网（mock API / MSW / 测试后端）。

| # | 场景 | 断言 |
|---|------|------|
| 1 | 打开首页 | 主 landmark/标题可见 |
| 2 | 主 mutation 成功路径（INPUTS §6） | 成功反馈；若成功后应跳转则 URL 已变；目标列表/详情含新数据（证明缓存已收敛） |
| 3 | 校验失败 | 无成功 toast；字段错误可见 |
| 4 | 未登录访受保护路由（若有鉴权） | 落到 login |
| 5 | API 500 mock | 错误态可重试 |

## CI

| 触发 | 命令 |
|------|------|
| PR | `pnpm check` |
| 发版 | `pnpm check && pnpm build && pnpm test:e2e`；`pnpm audit`（0 或 `docs/audit-exceptions.md`） |
