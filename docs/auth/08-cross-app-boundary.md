# 08 — 跨应用册边界

> **本册 = 鉴权 SSOT。**  
> `docs/react`、`docs/nextjs`、`docs/go`、`docs/fastapi` 只描述框架接线；**会话语义、Gate、Cookie、OAuth、失败码以本册为准**。冲突时改应用册引用，不平行发明第二套。

## 边界表

| 关切 | 本册（auth） | 应用册 |
|------|--------------|--------|
| Cookie 名/属性、TTL、hash 存贮 | SSOT（`03`/`INPUTS`） | 调用平台 API 设置 Cookie |
| Session Gate 步骤与失败类 | SSOT（`05`） | 中间件 / middleware / Depends 接线 |
| OAuth PKCE / 禁 Implicit | SSOT（`04`） | 路由与回调 URL |
| JWT 仅 API/机器 | SSOT（`06`） | 校验库选型 |
| CSRF 默认双重提交 | SSOT（`07`） | 前端带头 / 表单 |
| RSC / Server Action / chi / FastAPI 生命周期 | 引用 | 各册核心路径 |
| UI 组件样式 | 不写 | ui-ux / 应用册 |

## 对接要点（实现自写）

### nextjs

- Cookie：`cookies().set/get/delete`；保护：middleware 或布局内 Gate。  
- 未登录页：redirect（INPUTS）；API Route：401。  
- 详见应用册 `07-auth-env-cookies.md` — **须指向本册**，不得与本册 Cookie 默认冲突。

### react（SPA）

- 同站 Cookie + CSRF 头；禁 localStorage JWT 主会话。  
- 登录态 UI：`login` / `logout` / `session-expired`（`02`）。

### go

- `internal/session` 门闸；写方法 CSRF；OpenAPI `securitySchemes` 与会话路径。  
- 应用册 `07-auth.md` 的 Session 分支 **对齐** 本册；细规格以本册更新为准。

### fastapi

- 依赖注入 Gate；Authlib 仅 OAuth 客户端；Session 自管表。

## 禁止

- 应用册另钉「默认 JWT localStorage」覆盖本册。  
- 两册各写一套过期语义而不互相引用。

## 单测探针

| case | 期望 |
|------|------|
| 应用册文档引用 | 含指向 `docs/auth` 的链接或路径 |
| 跨册 Cookie 名 | 与 INPUTS/本册默认 `session` 一致 |
