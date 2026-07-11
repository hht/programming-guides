# 05 — Server Mutation Lifecycle（核心正确性路径）

## 不变量

全文唯一主路径：`读渲染 → Action 入参 → Zod → 授权 → 写 → revalidate → 返回结果`。

超越：

1. `对照：B 中更弱/未见「写路径强制 Server Action + Zod + revalidate」硬门闸 → 本指南要求写路径强制 Server Action + Zod + revalidate（见 05）`  
2. `对照：B 中更弱/未见「Client 边界最小化（默认 RSC）」硬门闸 → 本指南要求默认 RSC、Client 边界最小（见 03/05）`

## 步骤规格（钉死）

1. **定义 schema**：`lib/validations/<action>.ts`。  
2. **Action**：`"use server"` 函数；解析 `FormData` 或 typed 入参 → `schema.safeParse`。  
3. **失败**：返回 `{ ok:false, error:… }`（或抛 `ActionError`）；**不**写库。  
4. **授权**：INPUTS §5=无 → 跳过；否则按 `07` 读 `session` Cookie 并校验；未登录 → `{ ok:false, code:"unauthorized" }`。  
5. **写入**：事务/单点写；成功后 **默认 `revalidatePath`（钉死路径）**；若用 tag 缓存则 **额外** `revalidateTag`（tag 名在 Action 旁注释）。禁止只靠客户端乐观且不失效服务端缓存。  
6. **返回**：`{ ok:true, data? }` 或 `{ ok:false, error, code }`；Client 默认 **`useActionState`**。  
7. **禁止**：Action 内 `redirect` 掩盖错误；成功才 redirect（若需要）。  

## 失败分类

| code | 含义 |
|------|------|
| `validation` | Zod 失败 |
| `unauthorized` | 无会话 |
| `conflict` | 业务冲突 |
| `internal` | 未知 |

## 探针

| case | 期望 |
|------|------|
| 坏输入 | 不写库；ok=false |
| 成功写 | 刷新后 RSC 读到新值 |
| 未 revalidate | 视为缺陷（测试：旧缓存不得残留） |
