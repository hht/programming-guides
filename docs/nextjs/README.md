# Next.js App Router 开发指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**从零实现世界级门槛的 **Next.js 全栈 Web**。  
> **默认栈**：Node ≥22 + **pnpm** + **Next.js**（App Router）+ React 19 + TypeScript strict + **Server Components 默认** + **Server Actions** + **Zod** + **Tailwind CSS v4** + **shadcn/ui** + Vitest + Playwright。  
> **对位**：[../react/](../react/README.md)（Vite SPA；本册不混用 TanStack Router 当默认）。  
> **来源**：[sources.md](./sources.md)

## 品类一句话

用户通过 **URL 可分享的 Web 应用**完成浏览与提交；服务端渲染/读取与服务端变更边界清晰，缓存与 UI 在变更后一致。

## 核心正确性路径（全文唯一）

**Server Mutation Lifecycle**：`RSC 读 → 渲染 → Server Action + Zod → 写存储 → revalidate → UI/缓存一致`。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停  
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)  
3. [03](./03-app-router-and-layouts.md) / [04](./04-data-fetching-rsc.md) / [05](./05-server-mutation-lifecycle.md)  
4. [06](./06-forms-and-client.md) / [07](./07-auth-env-cookies.md) / [08](./08-quality-a11y-perf.md)  
5. [commands.md](./commands.md) `check`；发版 e2e  
6. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md)  

## 索引

| 文档 | 用途 |
|------|------|
| INPUTS / 00–11 / commands / sources / templates | 规格与模板 |
