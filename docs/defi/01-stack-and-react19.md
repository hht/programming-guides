# 01 — 技术栈

**默认固定为**：React 19 + Vite + TS strict + Tailwind + TanStack Query + viem + wagmi + RainbowKit。  
脚手架：`pnpm create vite@latest`（React + TS）后加上述依赖；**包版本取创建时 npm 最新稳定版并写入 lockfile**（viem/wagmi 建议锁 patch）。  
开 React Compiler；新代码不默认手写 memo。  

语言硬门闸：[typescript Language Gate](../meta/language-gates/typescript.md)；SPA 工程习惯链 [react/00](../react/00-principles.md)。`fmt`/`lint`/`typecheck` 字符串见 [commands.md](./commands.md)。

仅当 INPUTS 写明改栈时可换。实现在目标仓完成。
