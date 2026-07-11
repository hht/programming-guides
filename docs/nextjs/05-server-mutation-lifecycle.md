# 05 — Server Mutation Lifecycle（核心正确性路径）

> **全文唯一核心正确性路径。** 
> `读渲染 → Action 入参 → Zod → 授权 → 写 → revalidate → 返回结果`。

## 不变量

- 写路径 **强制** Server Action + Zod + 成功后 cache 失效（`revalidatePath` 默认；tag 见步骤 5）。 
- 默认 **RSC**；Client 边界最小（与 `00`/`03` 一致）；禁止「整页 `"use client"` 只为图省事」。 
- 失败 **不得** 用 `redirect` 掩盖；成功才允许 redirect。 
- 进行中禁止双提交（`useActionState` pending / 按钮 disabled）。 
- 超越： 
 1. `对照：B 中更弱/未见「写路径强制 Server Action + Zod + revalidate」硬门闸 → 本指南要求写路径强制 Server Action + Zod + revalidate（见 05）` 
 2. `对照：B 中更弱/未见「Client 边界最小化（默认 RSC）」硬门闸 → 本指南要求默认 RSC、Client 边界最小（见 03/05）`

## 步骤规格（须遵守）

| # | 步骤 | 规格 |
|---|------|------|
| 1 | **定义 schema** | `lib/validations/<action>.ts`；与 Action 入参字段同构；禁「UI 一套、Action 再手写解析」。 |
| 2 | **Action 入口** | `"use server"` 函数；解析 `FormData` 或 typed 入参 → `schema.safeParse`。 |
| 3 | **校验失败** | 返回 `{ ok:false, code:"validation", error:…, fieldErrors?: Record<path, message> }`（或抛约定 `ActionError`）；**零**写库。字段级错误优先 `fieldErrors`，与模板 [action-result.schema.json](./templates/action-result.schema.json) 同构。 |
| 4 | **授权** | INPUTS §5=无 → 跳过。否则按 `07` / [auth](../auth/README.md) 读会话；未登录 → `{ ok:false, code:"unauthorized" }`；已登录无权限 → `forbidden`。 |
| 5 | **写入** | 单点写或显式事务（对接 [postgres](../postgres/README.md) `05`）；成功后 **默认 `revalidatePath(<写明路径>)`**；若用 tag 缓存则 **额外** `revalidateTag`（tag 名在 Action 旁注释）。禁止只靠客户端乐观且不失效服务端缓存。 |
| 6 | **返回** | `{ ok:true, data? }` 或 `{ ok:false, error, code }`；Client 默认 **`useActionState`**（或等价 pending 绑定）。 |
| 7 | **导航** | 仅 `ok:true` 后 `redirect` / `router.push`；禁止在 validation/unauthorized 分支 redirect 到「成功页」。 |

### 伪代码（规格级）

```text
action(raw):
 parsed = schema.safeParse(raw)
 if !parsed.success → return { ok:false, code:"validation", error:… }
 session = readSession() // if auth required
 if !session → return { ok:false, code:"unauthorized" }
 if !authorize(session, parsed) → return { ok:false, code:"forbidden" }
 try:
 result = writeInTx(parsed) // or single statement
 revalidatePath(PATH) // + revalidateTag if used
 return { ok:true, data:result }
 catch e:
 return mapDbError(e) // conflict | internal | …
```

## 失败分类 / 默认值

| code | 条件 | 行为 |
|------|------|------|
| `validation` | Zod 失败 | 不写库；`fieldErrors` 映回表单字段；无字段则 `error` 汇总 |
| `unauthorized` | 无会话 | 不写库；UI 去登录或展示未登录 |
| `forbidden` | 已认证无权限 | 不写库；403 语义 |
| `conflict` | 唯一约束 / 业务冲突（如 `23505`） | 不假成功；专用文案 |
| `internal` | 未知 / 存储不可用 | 不假成功；可重试提示 |
| （pending） | Action 进行中 | 控件 disabled；忽略二次提交 |

## 禁令

- Action 内 `redirect` 吃掉 error。 
- 成功写库却忘记 `revalidatePath`/`Tag`（旧 RSC payload 残留 = 缺陷）。 
- 用 Route Handler 平行再实现一套无 Zod 的写 API 当默认（INPUTS 写明例外除外）。 
- 在 Action 里开长事务等客户端确认（见 postgres `05` 禁令）。

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 坏输入 | 不写库；`ok:false` + `validation` |
| 未登录（若需鉴权） | 不写库；`unauthorized` |
| 成功写 | 再读 RSC / fetch 到新值（revalidate 生效） |
| 故意去掉 revalidate | 测试失败或评审标缺陷（旧缓存不得残留） |
| 唯一冲突 | `conflict`；不标成功 |
| pending 双提交 | 第二次不产生第二笔写（或被忽略） |
| 校验失败后 redirect | **禁止**出现；探针：仍停在表单态 |
