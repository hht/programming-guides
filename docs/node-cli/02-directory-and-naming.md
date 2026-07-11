# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

## 目录树

```text
<repo>/
 package.json # bin, engines, type:module
 pnpm-lock.yaml
 tsconfig.json
 vitest.config.ts
 source/
 cli.ts # Pastel 入口（shebang）
 commands/ # Pastel 文件路由（唯一命令面）
 index.tsx # 默认命令
 <cmd>.tsx # cmd = 用户说出的业务动词
 <ns>/
 index.tsx
 <sub>.tsx
 ui/ # 可复用 Ink 组件（无业务 IO）
 domain/ # 纯函数：解析、校验、状态机
 services/ # 副作用：fs、fetch、子进程
 config/ # env + 配置文件加载（唯一读点）
 runtime/
 machine-result.ts # set/take 机器结果（无业务）
 build/ # tsc 输出（gitignore）
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

UI 状态矩阵：Ink 帧态按 INPUTS 命令矩阵交付；**非** Web 四态产品 UI。无 TUI 交互的纯批处理命令可标 `N/A`。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建 `UBIQUITOUS_LANGUAGE.md`（CLI 用户语言 = 命令语言）。 
2. **命令 / 子命令 / domain 模块** = 用户任务与业务操作（`auth login`、`deploy release`），禁 `run`/`exec`/`do-stuff`/`manage`。 
3. **禁** `*Helper` `*Manager` `process*` `handle*` 作命令或 domain 导出名。 
4. exit 语义、错误文案与词表同根。

| 概念 | 正例 | 反例 |
|------|------|------|
| 命令 | `auth login` | `runAuth` / `doLogin` |
| domain | `domain/session.ts` | `domain/auth-manager.ts` |
| 副作用 | `services/fetch-profile.ts` | `services/http-helper.ts` |

### Pass 2 — 语法（后）

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
