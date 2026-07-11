# 03 — 平台与入口

## 不变量

- INPUTS §1 **互斥**选一平台；默认 **Cloudflare Workers**。  
- 每个部署单元 **唯一入口** 文档化；Lifecycle 步骤平台无关，仅适配层不同。  
- 禁止双平台同时当生产 SSOT。

## 步骤规格（实现自写）

### A. Cloudflare Workers + TypeScript（默认）

1. **项目**：Wrangler 管理；`compatibility_date` = INPUTS §12。  
2. **入口**：
   ```text
   // 规格：唯一默认导出
   const app = new Hono()
   // 注册 features/*/route
   export default { fetch: app.fetch }
   ```  
3. **本地**：`wrangler dev`（或等价）可触发 `fetch`；与生产同一入口符号。  
4. **绑定**：在 wrangler 声明；类型生成（`wrangler types`）进仓；业务经 `env` / `c.env` 读取，禁硬编码账号。

### B. OpenNext / Vercel Functions（备选）

1. **仅当 INPUTS §1 勾选**；§13 钉适配目标。  
2. **入口**：App Router `route.ts` 的 `GET`/`POST`/… = Functions 入口；对齐 [nextjs](../nextjs/README.md) 目录，**Invocation Lifecycle 仍以本册 `05` 为准**。  
3. **构建**：按所选 OpenNext 适配器或 Vercel 托管文档；禁同时维护「另一套裸 Workers」无书面边界。

### C. AWS Lambda（条件）

1. **仅当 INPUTS §1 勾选**；运行时/架构见 §14。  
2. **入口**：`export async function handler(event, context)`（或框架封装，但须可指出等价步骤）。  
3. **事件源**：HTTP（Function URL / API Gateway）或队列等 — 触发表进 INPUTS §5。  
4. **映射学习**：Middy / Powertools 的中间件链可对照，**不得**替代本册超时/幂等硬门闸。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 未选平台 / 双选 | `INPUTS BLOCKED`；禁开工 |
| 入口导出缺失 | 构建/部署非 0 |
| 绑定未声明却读取 | 启动或首请求失败；禁静默 `undefined` 当成功 |
| 用常驻 Node 冒充 | 验收红灯 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 默认导出可 fetch | 200 或约定业务 status |
| 错误平台组合 | INPUTS / CI 拒绝 |
| 缺 compatibility_date（Workers） | 配置检查失败 |
