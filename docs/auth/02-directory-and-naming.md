# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

## 树（写明词根；路径可按应用册微调，**词根不可改**）

```text
<repo>/
 UBIQUITOUS_LANGUAGE.md
 # --- 按应用册 ---
 # Next / React：features/session/ 或 app 内 session 边界
 # Go：internal/session/（门闸、签发、撤销）
 # FastAPI：session/ 包（门闸依赖、签发）
 migrations/ # sessions 表（或等价）
 # 禁：auth_manager/、dto/、handleLogin.ts 作领域主名
```

## 依赖方向

```text
HTTP/Edge → Session Gate → (可选) Authorize → 业务用例
 ↓
 Session Store (PG / 将来 Redis)
OAuth callback → 校验 code+PKCE → 签发本应用 Session → Set-Cookie
```

禁止：业务用例直接读 raw Cookie 绕过 Gate；Gate 内嵌业务规则（权限细则可在 Authorize 步，须可测）。

## UI 状态落点（有产品 UI 时必做）

| 状态 | 含义 | 落点 |
|------|------|------|
| `login` | 未认证，展示登录 | 路由/页：默认 `/login` |
| `logout` | 用户主动结束会话 | 动作：清 Cookie + 删会话行 |
| `session-expired` | 曾有会话现已无效 | 提示 + 回 `login`；API 仍 401 |

无产品 UI（纯 API）→ 上表标 **N/A**，仅保留 HTTP 语义（401/204）。

## Pass 1 — 业务语义（必做）

目标仓建立 `UBIQUITOUS_LANGUAGE.md`，至少收录：

| Term | 含义 | 代码符号 | 禁同义词 |
|------|------|----------|----------|
| Authorize | 已认证后的权限检查 | `Authorize` / `requirePermission` | `AuthzManager`；与 Gate 合并成 `AuthManager` |
| Session | 服务端会话记录 | `Session` | AuthToken 混用当会话实体 |
| Subject | 已认证主体 id | `subject` / `Subject` | userId 分叉（择一写明） |
| Session Gate | 验会话并注入身份 | `SessionGate` / `requireSession` | `AuthManager`、`handleAuth` |
| Login | 建立会话 | `Login` / `login` | `signIn` 若词表未收则禁并行 |
| Logout | 撤销会话 | `Logout` / `logout` | `signOut` 同上 |
| OAuth Login | 经 IdP 后签发本会话 | `OAuthLogin` | — |
| SESSION_EXPIRED | 会话/JWT 过期 | `SESSION_EXPIRED` | — |
| SESSION_INVALID | 篡改/撤销/坏凭证 | `SESSION_INVALID` | — |
| CSRF_FAILED | CSRF 校验失败 | `CSRF_FAILED` | `CSRF_REJECTED` |

**禁**：`*Dto`、`*Manager`、`*Service`（作类型后缀）、`handle*`、`process*`、`AuthHelper` 进领域主名。

| 概念 | 正例 | 反例 |
|------|------|------|
| 模块 | `session/`、`internal/session` | `auth_manager/`、`authService/` |
| 门闸 | `RequireSession` / `sessionGate` | `HandleAuth`、`AuthMiddlewareManager` |
| 错误 | `SESSION_EXPIRED`、`UNAUTHENTICATED` | `ERR_AUTH_1`、`DtoValidationFailed` |

## Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| TS | 类型/组件 Pascal；函数 camel；文件 kebab 或与仓一致 |
| Go | 导出 Pascal；包名 `session` |
| Python | 模块 snake；类 Pascal |
| Cookie / 头 | `session`、`csrf_token`、`X-CSRF-Token`（INPUTS 可改 Cookie 名） |
| 错误码 | `SCREAMING_SNAKE` 与词表一致 |
| DB 列 | snake_case：`subject`、`token_hash`、`expires_at` |
