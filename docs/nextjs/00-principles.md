# 00 — 原则

## 决策优先级

正确性 > 可验证性 > 简洁性 > 复用 > 速度。

## 硬不变量

1. **默认 Server Component**；`"use client"` 仅交互边界。  
2. **写操作走 Server Action**（或 Route Handler 若 INPUTS 明示）；禁默认「纯客户端 fetch 写库」。  
3. **Zod 校验**在 Action 入口；失败返回可辨错误，不假成功。  
4. **变更后 revalidate**（`revalidatePath`/`revalidateTag`）钉死，禁只靠客户端乐观却不失效服务端缓存。  
5. **密钥不进 `NEXT_PUBLIC_*`**。  
6. **deletion-first**；与 Vite SPA 指南边界清晰，不抄 Router 栈。

## SSOT

| 真相 | Owner |
|------|--------|
| 路由树 | `app/` |
| 读数据 | RSC / `04` |
| 写路径 | `05` Server Action |
| 环境 | INPUTS §6 + `.env.example` |

## 超越

1. `对照：B 中更弱/未见「写路径强制 Server Action + Zod + revalidate」硬门闸 → 本指南要求`  
2. `对照：B 中更弱/未见「Client 边界最小化（默认 RSC）」硬门闸 → 本指南要求`
