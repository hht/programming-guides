# React SPA 开发指南

> **这是工程指南，不是半成品项目。** 
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**从零实现世界级门槛的 React SPA。 
> **默认栈**：Node ≥22 + pnpm + Vite + React 19 + TypeScript strict + **TanStack Router** + **TanStack Query** + **Zustand** + **Zod** + **react-hook-form** + **Tailwind CSS v4** + **shadcn/ui** + **date-fns** + **es-toolkit** + Vitest + Playwright。 
> **来源**：[sources.md](./sources.md)

## 品类一句话

用户在浏览器使用 **单页应用** 完成浏览与提交类任务；路由、服务端数据与本地 UI 状态边界清晰，错误与加载态诚实。

## 核心正确性路径（全文唯一）

**Mutation Lifecycle**：`匹配路由 → Query 加载 → 渲染四态 → Zod 校验 → Mutation → await invalidate → UI 与缓存一致`。

## Agent 执行协议

1. 校验 [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或列缺口（停） 
2. 按 [01](./01-stack.md) 建栈；目录按 [02](./02-directory-and-naming.md) 
3. 按 [03](./03-routing-and-layouts.md) 落地路由与壳 
4. 按 [04](./04-data-fetching.md) / [05](./05-mutation-lifecycle.md) / [06](./06-forms-and-ui.md) 实现核心路径（**自写，勿抄业务模块**） 
5. 按 [07](./07-client-state-auth-env.md) / [08](./08-quality-a11y-perf.md) 接会话、质量门禁 
6. [commands.md](./commands.md) 绿 + [11](./11-world-class-acceptance.md) 全勾 

## 文档索引

| 文档 | 用途 |
|------|------|
| [INPUTS.md](./INPUTS.md) | 输入门闸 |
| [00-principles.md](./00-principles.md) | 不变量 |
| [01-stack.md](./01-stack.md) | 栈 |
| [02-directory-and-naming.md](./02-directory-and-naming.md) | 目录 |
| [03-routing-and-layouts.md](./03-routing-and-layouts.md) | 路由 |
| [04-data-fetching.md](./04-data-fetching.md) | Query |
| [05-mutation-lifecycle.md](./05-mutation-lifecycle.md) | 核心路径 |
| [06-forms-and-ui.md](./06-forms-and-ui.md) | 表单 / shadcn |
| [07-client-state-auth-env.md](./07-client-state-auth-env.md) | Zustand / 鉴权 / env |
| [08-quality-a11y-perf.md](./08-quality-a11y-perf.md) | 质量 / a11y / 性能 |
| [09-testing-ci.md](./09-testing-ci.md) | 测试 |
| [10-checklist.md](./10-checklist.md) | 清单 |
| [11-world-class-acceptance.md](./11-world-class-acceptance.md) | 验收 |
| [commands.md](./commands.md) | 命令 |
| [sources.md](./sources.md) | 标杆 |
| [templates/](./templates/README.md) | 非业务碎片 |

## 心智模型

```text
INPUTS → Vite+React 栈 → 路由壳 → Query/Mutation → 表单与 shadcn → check → 验收
```
