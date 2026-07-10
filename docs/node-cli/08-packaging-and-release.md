# 08 — 打包与发版

## 不变量

- `package.json#bin` 可执行；发布文件含 `build/` 与必要 assets  
- `files` 字段白名单，避免把测试/源码地图误发（按产品选择是否发 `source`）  
- Node `engines` 与运行时一致（`>=22`）

## 步骤规格

1. `pnpm build` → `tsc` 输出到 `build/`。  
2. 入口保留 shebang；`chmod` 在打包工具/ npm 发布时由 bin 链接处理。  
3. 本地验：`pnpm link --global` 或 `node build/cli.js --help`。  
4. 版本：semver；changelog 人工或 conventional（可选）。  
5. CI 发版 job：`pnpm check && pnpm build && pnpm test:e2e` 绿才 publish（token 在 CI 密钥，不进仓）。  
6. 可选：homebrew/docker 不进必做。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 发布缺 bin | 门禁失败 |
| engines 不符 | 安装时 npm 警告；文档声明最低 Node |

## 单测探针

| case | 期望 |
|------|------|
| `node build/cli.js --help` | exit 0 |
| package.json bin 路径存在 | check 脚本断言文件存在 |
