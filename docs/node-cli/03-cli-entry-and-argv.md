# 03 — CLI 入口与 argv

## 不变量

- 唯一入口：`source/cli.ts` → `new Pastel({ importMeta: import.meta }).run()`  
- 每个命令的 flags/args **只**由该文件导出的 Zod `options` / `args` 定义  
- `--help` / `-h` 由 Pastel/Commander 生成，禁止手写第二套 help 字符串 SSOT

## 步骤规格（实现自写）

1. `cli.ts` 首行 shebang；`package.json#bin` 指向编译后路径。  
2. `cli.ts` 必须：`await app.run()` 之后 `takeMachineResult()` 再写 stdout（见 `05`）；不要在 Pastel 外部再包 `render()`。  
3. 按 INPUTS 命令树在 `source/commands/` 建文件/文件夹。  
4. 每个命令：  
   - `export const options = z.object({...})`（可空对象）  
   - `export const args`（若需要位置参数）  
   - `export default function Command(props)` 返回 Ink 树  
5. `.describe()` 写清每个 flag，保证 help 可读。  
6. 布尔确认类 flag（如 `--yes`）默认 `false`；与 INPUTS 非交互策略一致。  
7. 版本：`package.json#version`；暴露 `--version`。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| Zod 校验失败 | 打印错误到 stderr；exit = INPUTS「校验失败」码（默认 **2**） |
| 未知命令 | stderr 提示 + help 摘要；exit = **2** |
| 命令未实现（开发中） | 禁止静默；stderr「not implemented」；exit = **1** |

## 单测探针

| case | 期望 |
|------|------|
| 必填 option 缺失 | 非 0；stderr 含字段名 |
| `--help` | 0；stdout 含命令名与 option 描述 |
| 合法最小 argv | 进入命令组件（可用 ink-testing-library 或集成测） |
