# 02 — 目录与命名

## 目录树（钉死）

```text
<repo>/
  package.json          # bin, engines, type:module
  pnpm-lock.yaml
  tsconfig.json
  vitest.config.ts
  source/
    cli.ts              # Pastel 入口（shebang）
    commands/           # Pastel 文件路由（唯一命令面）
      index.tsx         # 默认命令
      <cmd>.tsx
      <ns>/
        index.tsx
        <sub>.tsx
    ui/                 # 可复用 Ink 组件（无业务 IO）
    domain/             # 纯函数：解析、校验、状态机
    services/           # 副作用：fs、fetch、子进程
    config/             # env + 配置文件加载（唯一读点）
    runtime/
      machine-result.ts # set/take 机器结果（无业务）
  build/                # tsc 输出（gitignore）
  # 测试默认：与源码旁挂 source/**/*.test.ts(x)；勿再建平行 test/ 树
```

## 依赖方向

```text
commands → ui → domain
commands → services → domain
commands → config
commands → runtime/machine-result
services → config
cli.ts → runtime/machine-result（take）
```

禁止：`domain` → `ink` | `services`；`ui` → `services` | `config` | `process.env`（展示数据由 props 注入）。

## 命名

| 种类 | 规则 |
|------|------|
| 命令文件 | kebab 与 CLI 子命令一致：`source/commands/auth/login.tsx` → `auth login` |
| Zod options | 导出 `options` / `args`（Pastel 约定名，勿改） |
| 组件 | PascalCase；钩子 `useXxx` |
| env | `SCREAMING_SNAKE`；前缀用产品名，如 `MYCLI_API_URL` |
| exit 常量 | `EXIT_OK=0` 等集中在 `domain/exit-codes.ts` |

## 禁止

- `utils/` / `helpers/` 大口袋（按 domain/services/ui 归类）  
- 在 `commands/` 外再维护第二套 argv 解析  
- 把业务 fetch 写进 `ui/`
