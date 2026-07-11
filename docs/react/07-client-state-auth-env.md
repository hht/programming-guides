# 07 — 客户端状态、鉴权与环境

## 不变量

- Zustand：**不**存服务器实体列表/详情 
- env：启动时 Zod parse；缺必填 → 抛错阻止挂载 
- 鉴权按 INPUTS §5 

## 步骤规格

### Zustand

```text
useUiStore: sidebarOpen, theme, …
useSessionStore: status: 'anonymous'|'authenticated'|'unknown'；userId?；禁存 accessToken 明文到 persist
```

`persist` 中间件仅用于非敏感 UI；会话 token 不走 persist。

### 鉴权

| INPUTS | 行为 |
|--------|------|
| 无登录 | 无 beforeLoad 门闸；无 session store 亦可 |
| Cookie session | `credentials: 'include'`；cookie **SameSite=Lax**（或 Strict）；若非 SameSite 可挡跨站写，须 CSRF token（INPUTS 附头字段名）；401 → anonymous |
| Bearer memory | token **仅** `api/token.ts` 模块变量；**禁止**写入 `useSessionStore` / persist；刷新页 → 重新登录 |
| OAuth | 回调路由处理 code；换会话后 **token 落点必须再勾 Cookie session 或 Bearer memory 之一**（写进 INPUTS），其余同该选项 |

登录成功：先 `ensureQueryData(queryKeys.session.me())`（或 INPUTS 探测端点）→ `invalidateQueries` 用户相关 key + 设 session status。 
登出：清 session + `queryClient.clear()`。

### env

```text
envSchema = z.object({
 VITE_APP_ENV: z.enum(['development','staging','prod']),
 VITE_API_BASE_URL: z.string().url(),
})
```

## 失败分类

| 情况 | 行为 |
|------|------|
| env 非法 | 红屏/启动失败，勿静默默认 prod |
| 401 | 见上 |

## 单测探针

| case | 期望 |
|------|------|
| env 缺 URL | parse 抛错 |
| 登出 | queryClient.clear 被调 |
