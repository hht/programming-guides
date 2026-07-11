# 01 — 栈

| 层 | 选择 |
|----|------|
| **默认平台** | **Cloudflare Workers** + **TypeScript**（先进边缘：Web Standards `fetch`、全球边缘、Wrangler 一体） |
| **备选平台** | **OpenNext / Vercel Functions**（仅 INPUTS 互斥选中；全栈 Next 部署面） |
| **条件平台** | **AWS Lambda**（仅 INPUTS 勾选；事件源/合规需要时） |
| HTTP 框架（Workers 默认） | **Hono**（`hono`）挂到 `export default { fetch: app.fetch }`；禁再引入 Express 当边缘默认 |
| 工具链（Workers） | **Wrangler**（跟 `cloudflare/workers-sdk`）、**Vitest** + Workers pool（或平台推荐 test）、**TypeScript** strict |
| OpenNext（若选） | 按 INPUTS §13 选定一个目标适配器；App Router 对齐 [nextjs](../nextjs/README.md) |
| Lambda（若选） | 运行时 **nodejs20.x**；中间件映射可学 Middy / Powertools，**规格以本册 Lifecycle 为准** |
| 包管理 | **pnpm**（与多数 TS 册一致）；`pnpm-lock.yaml` 提交 |
| 禁止冒充 | 长驻自建 HTTP 进程 **不得**进入本册「边缘 / Functions」验收路径（应改走 go/fastapi 等 API 册） |

禁止：留下「Workers 或 Vercel 任选」开口；默认采用 Lambda；边缘默认 Express/Koa。

## 脚手架

```bash
# --- Cloudflare Workers + TypeScript（默认）---
pnpm create cloudflare@latest <name> -- --type=hello-world --ts --git=false
cd <name>
pnpm add hono
# wrangler.toml：name、main、compatibility_date（按 INPUTS 约定）、vars 名（值按环境）
# src/index.ts：Hono app → export default { fetch: app.fetch }

# --- OpenNext / Vercel Functions（INPUTS 互斥选中时）---
# 对齐 nextjs 册建 App Router；再按 §13 接 opennextjs-cloudflare | opennextjs-aws | Vercel 托管
# Route Handler = Functions 入口；Lifecycle 步骤不变

# --- AWS Lambda（INPUTS 条件勾选时）---
# 运行时 nodejs20.x；handler 文件路径固定；事件源与超时在 IaC/控制台与 INPUTS 一致
```

## 版本

| 项 | 策略 |
|----|------|
| TypeScript | **≥5.4**；`strict: true` |
| Wrangler | 跟 workers-sdk 稳定大版本；`compatibility_date` 须填写不漂移 |
| Hono | 锁 major；升级走 PR + `check` |
| Node（Lambda / OpenNext 构建） | **20 LTS** 与运行时一致 |
| lockfile | 必须提交；禁无锁发版 |

## 冲突裁决（写入 sources）

| 冲突 | 裁决 |
|------|------|
| Vercel / Lambda 下载与心智份额更大 | **不作默认边缘**；OpenNext/Vercel、Lambda 仅 INPUTS；**默认 Cloudflare Workers**（先进优先） |
| Express 熟悉度 | **禁**作 Workers 默认；采用 Hono + Web Standards |
| 自建常驻 Node「也算 serverless」 | **禁止**本册验收路径 |
