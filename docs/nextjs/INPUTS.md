# INPUTS — 缺则停

| # | 项 | 验收 |
|---|-----|------|
| 1 | **用户任务** | 角色+成功标准 |
| 2 | **页面/路由清单** | `path` \| RSC/CSR \| 主 CTA \| 四态需求 |
| 3 | **数据源** | □ DB（必用 **Drizzle** + drizzle-kit）□ 外部 HTTP API（`fetch`+Zod）□ 二者；契约路径；staging/prod 成对 |
| 3b | **错误码** | `validation`/`unauthorized`/`conflict`/`internal` 映射或 `N/A` 表 |
| 4 | **变更入口** | 哪些表单/按钮走 Server Action（默认全部写操作） |
| 5 | **鉴权** | □ 无（`05` 跳过授权）□ Cookie 会话（名=`session`；步骤见 `07`）。**禁止**勾选后留空；非 Cookie → **停**，另开/等 `docs/auth`（本册不验收） |
| 6 | **环境变量名** | `NEXT_PUBLIC_*` 与服务端密钥名成对；含 `SESSION_SECRET`（若 Cookie）；无明文 |
| 7 | **部署目标** | □ Vercel □ Node 自托管。须写 staging/prod 健康检查 URL（含 scheme）；密钥名与 §6 同表。**禁止**未文档化「其它」空过 |
| 8 | **设计** | Figma/handoff 或 `N/A` |
| 9 | **登录 path** | 默认 `/login`；可改（仅 Cookie 鉴权时） |

## 门闸

缺任一项谓词 → 停写。全部满足后输出：

```text
INPUTS OK
```
