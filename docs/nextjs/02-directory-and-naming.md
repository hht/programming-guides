# 02 — 目录与命名

```text
src/
  app/
    (app)/
      layout.tsx
      page.tsx
      <segment>/
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

| 种类 | 规则 |
|------|------|
| Route segment | kebab-case 文件夹 |
| Action 名 | `verbNounAction` |
| Schema | `*Schema` |
