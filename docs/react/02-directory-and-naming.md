# 02 — 目录与命名

## 树（钉死）

```text
<repo>/
  package.json
  pnpm-lock.yaml
  vite.config.ts
  tsconfig.json
  components.json          # shadcn
  index.html
  src/
    main.tsx
    routeTree.gen.ts       # TanStack 生成，勿手改
    routes/                # 文件路由
      __root.tsx
      index.tsx
      _app.tsx             # 需登录布局（示例名）
      _app/
        dashboard.tsx
      login.tsx
    api/
      client.ts
      query-keys.ts
      schemas/
    features/              # 按业务域
      <domain>/
        ui/                # 该域组合组件
        hooks/
        model/             # 纯函数
        # schema：只从 api/schemas import，禁止域内第二套
    components/
      ui/                  # shadcn 生成
      layout/
    stores/                # zustand
    config/env.ts          # Zod parse；细则见 07 / INPUTS #8
    lib/utils.ts           # cn() 等
    i18n/
    styles/
  # 测试默认：与源码旁挂 src/**/*.test.ts(x)；勿再建平行 tests/ 树
```

## 依赖方向

```text
routes → features → api/schemas → domain 纯函数（可放 features/*/model）
routes → components/layout → components/ui
features → stores（仅 UI）
features → api/client
```

禁止：`components/ui` → `features`；`stores` 内发 HTTP；`api` → `components`。

## 命名

| 种类 | 规则 |
|------|------|
| 路由文件 | TanStack 约定；path 与文件名一致 |
| Query key | `queryKeys.resource.detail(id)` 工厂 |
| Store | `useXxxStore` |
| Schema | `createFooSchema` / `fooSchema` |
| 工具函数 | es-toolkit 具名 import；日期 `format`/`parseISO` from date-fns |

## 状态 UI 落点

| 态 | 落点 |
|----|------|
| pending/empty/error/success/not-found | `features/<domain>/ui` 或路由组件内 |
| 未登录 / session unknown | 布局/`beforeLoad` + `features/auth`（若有） |
