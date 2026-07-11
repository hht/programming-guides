# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
src/
  app/
    (app)/
      layout.tsx
      page.tsx
      <segment>/            # segment = 业务能力/资源
        page.tsx
        actions.ts           # 默认 colocate
    api/                     # 仅 webhook/外部
  components/
    ui/
  lib/
    db.ts | api.ts
    validations/
```

依赖：`app → components → lib`；禁 `lib` 导入 `app`。禁无归属的 `app/actions/` 大口袋。

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
