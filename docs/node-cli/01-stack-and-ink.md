# 01 — 默认栈（钉死）

## 栈

| 层 | 选择 | 版本策略 |
|----|------|----------|
| Runtime | **Node.js ≥22** | `engines.node` 写入 `>=22`；CI 用当前 LTS≥22 |
| 语言 | **TypeScript strict** + **ESM**（`"type":"module"`） | `strict: true`；禁松散 any 逃逸为默认 |
| 包管理 | **pnpm** | 提交 `pnpm-lock.yaml` |
| TUI | **`ink@^7`** | 与 React 19 peer 对齐 |
| UI 运行时 | **`react@^19.2`** + `@types/react` | 跟随 Ink peer |
| CLI 框架 | **`pastel@^4`** | 文件路由命令；底层 Commander |
| Flag 校验 | **`zod@^4`** | Pastel peer；options/args 唯一 schema |
| 组件 | **`@inkjs/ui@^2`** | Spinner/Select 等；缺则自写 Ink 组件 |
| 颜色 | Ink `<Text color>`；**不**另加 `chalk` 依赖（Ink 已传递） | |
| 测试 | **Vitest** + **`ink-testing-library@^4`** | 组件帧断言 |
| 构建 | **`tsc`**（Pastel 官方路径） | `outDir=build`；`bin` 指向 `build/cli.js` |
| Lint | **ESLint** flat + **typescript-eslint** | `pnpm check` 含 lint+typecheck+unit |

**禁止开口**：不得写「meow 或 commander 任选」「Ink 或 Blessed 任选」。

## 脚手架（按序）

```bash
# 1) 官方 Pastel 脚手架（若 create-pastel-app 可用）
pnpm create pastel-app <name>
# 或: npm create pastel-app <name>

# 2) 进入仓库，统一包管理与引擎
cd <name>
pnpm import   # 若生成的是 npm lock，转为 pnpm；否则 pnpm install
```

手动等价（脚手架不可用时）：

1. `pnpm init` + `"type":"module"` + `engines.node: ">=22"`  
2. `pnpm add pastel ink react zod @inkjs/ui`  
3. `pnpm add -D typescript @types/react @types/node vitest ink-testing-library @sindresorhus/tsconfig`  
4. 按 Pastel README 建 `source/cli.ts`、`source/commands/index.tsx`  
5. `package.json`：`"bin": { "<cli-name>": "./build/cli.js" }`，入口文件首行 `#!/usr/bin/env node`

## 锁版本

- 应用依赖：`^` 主版本内；发版前 `pnpm outdated` 人工确认  
- 禁止无理由 pin 到 fork 的 ink（标杆 B 的 fork **不**采用）

## React 注意

- 无 DOM：禁止 `document` / `window`  
- 副作用用 Ink hooks（`useInput` / `useApp` / `useStdout`）；清理在 unmount  
- 不默认引入 React Compiler（终端 reconciler 非浏览器；若将来官方支持再开）
