# INPUTS — 缺则停

| # | 项 | 验收 |
|---|-----|------|
| 1 | **用户任务** | 角色+成功标准 |
| 2 | **页面/路由清单** | `path` \| RSC/CSR \| 主 CTA \| **路由四态**（列名固定：`default`/`loading`/`empty`/`error`，与 [templates/page-state-matrix.md](./templates/page-state-matrix.md) 一致）\| **公开?** □是□否 |
| 3 | **数据源** | □ DB（必用 **Drizzle** + drizzle-kit）□ 外部 HTTP API（`fetch`+Zod）□ 二者；契约路径；staging/prod 成对 |
| 3b | **错误码** | 至少含 `validation`/`unauthorized`/`forbidden`/`conflict`/`internal` 映射或逐码 `N/A`+理由 |
| 4 | **变更入口** | 哪些表单/按钮走 Server Action（默认全部写操作）；每条可附默认 `revalidatePath` |
| 5 | **鉴权** | □ 无（`05` 跳过授权；发版矩阵 #4=`N/A`）□ Cookie 会话（名=`session`；步骤见 `07`）。**禁止**勾选后留空；非 Cookie → **停**，另开/等 `docs/auth`（本册不验收） |
| 5b | **授权**（仅 §5=Cookie） | □ 仅会话即全权（无细粒度）□ 有角色/权限表（路径或角色→允许操作）。未勾=BLOCKED |
| 5c | **私有 path 前缀**（仅 §5=Cookie） | 默认 `/` 下除登录与公开 path 外均私有；或显式前缀列表（例 `/app`）。须与 middleware `matcher` 一致 |
| 5d | **会话载荷**（仅 §5=Cookie） | 默认 **signed cookie**：claims 仅允许 `sub`（Subject id 字符串）+ `exp`（unix 秒）；算法 HMAC-SHA256 + `SESSION_SECRET`；`maxAge` 默认 7d。禁止另增未文档化 claim。若改 opaque+DB → **停**，改走 `docs/auth` |
| 5e | **登录表单字段**（仅 §5=Cookie） | 默认 `email` + `password`（字段名固定）；改字段须写明列表。签发入参=校验通过后的 `sub` |
| 5f | **身份校验 SSOT**（仅 §5=Cookie） | 须勾且仅一：□ **DB 用户表**（表名+`password_hash` 列名；校验=`email` 查行 + 核哈希，算法默认 **argon2id**；`sub`=主键字符串）□ **对接 docs/auth**（书面路径）□ **单用户环境**（`LOGIN_EMAIL`+`LOGIN_PASSWORD_HASH` env；`sub` 固定字符串 **`demo`**；仅 staging/demo，prod 禁）。未勾=BLOCKED |
| 6 | **环境变量名** | `NEXT_PUBLIC_*` 与服务端密钥名成对；含 `SESSION_SECRET`（若 Cookie）；无明文 |
| 7 | **部署目标** | □ Vercel □ Node 自托管。须写 staging/prod 健康检查 URL（含 scheme）；密钥名与 §6 同表。**禁止**未文档化「其它」空过 |
| 8 | **设计** | Figma/handoff 或 `N/A` |
| 9 | **登录 path** | 默认 `/login`；可改（仅 Cookie 鉴权时） |

## 门闸

缺任一项谓词 → 停写。全部满足后输出：

```text
INPUTS OK
```
