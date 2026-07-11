# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

## 树（钉死）

```text
src/
  middleware.ts              # §5=Cookie 时必有；§5=无则可省略
  app/
    (app)/
      layout.tsx
      page.tsx
      <segment>/              # segment = 业务能力/资源（禁 pages/stuff）
        page.tsx
        loading.tsx            # 路由 loading（四态）
        error.tsx              # 路由 error（四态）
        actions.ts             # 默认 colocate Server Actions
        _components/           # 仅本 segment 用的业务 UI（可选）
    api/                       # 仅 webhook/外部；禁平行无 Zod 写 API 当默认
  components/
    ui/                        # 无业务的 DS 原子；禁把业务页塞进 ui/
  features/                    # 跨 segment 复用的业务块（可选；仍按业务名）
  lib/
    db.ts | api.ts
    validations/
    db/schema.ts               # INPUTS §3=DB 时 Drizzle schema SSOT（可拆多文件同目录）
```

依赖：`app → components|features → lib`；禁 `lib` 导入 `app`。禁无归属的 `app/actions/` 大口袋；禁 `components/` 堆业务页（业务进 `app/.../_components` 或 `features/<业务>`）。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建 `UBIQUITOUS_LANGUAGE.md`。  
2. **Route segment、Server Action、validation schema 根名** = 领域能力/实体/操作（`orders`、`placeOrderAction`），禁 `data`、`misc`、`handleSubmit`、`processForm`。  
3. **禁** `*Dto` `*Manager` `*Helper`；Route Group `(app)` 仅为布局，不是业务名借口。  
4. URL 与产品信息架构同根。

| 概念 | 正例 | 反例 |
|------|------|------|
| segment | `orders` / `checkout` | `pages` / `stuff` |
| Action | `placeOrderAction` | `handleSubmitAction` |
| Schema | `orderSchema` | `payloadSchema` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| Route segment | kebab-case 文件夹（词来自 Pass 1） |
| Action 名 | `verbNounAction`；verb/noun = 词表 |
| Schema | `*Schema`；根 = 词表实体 |

## 状态 UI 落点（两层；禁止混名）

| 层 | 列集合（钉死） | 落点 |
|----|----------------|------|
| **路由四态**（SSOT） | `default` / `loading` / `empty` / `error` | `page.tsx` + `loading.tsx`/`error.tsx` 或页内分支；矩阵=[templates/page-state-matrix.md](./templates/page-state-matrix.md)；INPUTS §2 同列名 |
| **表单局部态** | `idle` / `loading` / `error` / `success` | 仅 Client 叶 / `useActionState`（见 `06`）；**不要**把 `success` 写进路由四态列 |

映射：App Router 的 `pending` UI ≡ 路由 `loading`；有数据的成功渲染 ≡ 路由 `default`（或 `empty` 若列表长度为 0）。

未登录：INPUTS §5 Cookie → middleware/`07`（matcher=§5c）；§5 无 → N/A。
