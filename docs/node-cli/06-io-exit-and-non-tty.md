# 06 — I/O、exit 与非 TTY

## 不变量

- `stdin.isTTY && stdout.isTTY` 为真才进入全屏交互（除非 INPUTS 明确允许 stdout pipe + stdin TTY 等变体并写测试）  
- CI：仅当 `process.env.CI === 'true'`（字符串）或 `--yes` 时走非交互（若 INPUTS 要求支持）。**不**把 `CI=1` 当真。  
- Exit code 集中定义，禁止魔法数字散落

## 步骤规格

1. 实现 `domain/exit-codes.ts`：`OK=0`、`ERROR=1`、`USAGE=2`、`CANCEL=130`（与 INPUTS 表一致；**禁止** CANCEL=1）。  
2. 启动时检测 TTY：不满足且命令需要 TUI → stderr `ERROR:USAGE …` → exit **2**。  
3. **管道 / 无 TTY 成功路径**：仅走 INPUTS §9 钉死的 argv；机器 stdout **只允许**：无，或 **单行 JSON**（与 INPUTS §6 一致）。禁止另发明 JSON Lines/纯文本格式。零 Ink 或仅静态一次渲染后走 `cli.ts` take 写出。  
4. 信号：`SIGINT` 与 `SIGTERM` 同等处理 → abort → 清理 → `exitCode=130`。  
5. 禁止把进度条写到 stdout（若 stdout 留给机器解析）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 非 TTY + 无非交互实现 | exit **2**；stderr `ERROR:USAGE not a TTY` |
| CI 无 `--yes` 且命令需要确认 | exit **2**；stderr `ERROR:USAGE --yes required` |
| SIGINT / SIGTERM | abort → 清理 → **exit 130** |
| 双重写（TUI 又污染 stdout 机器流） | 视为缺陷；测试禁止 |

## 单测探针

| case | 期望 |
|------|------|
| mock `isTTY=false` 跑交互命令 | 非 0；无抛未捕获 |
| 成功且有 JSON 结果 | stdout 可 `JSON.parse`；不含 Spinner 字符 |
| SIGINT 模拟 | 取消码；清理函数被调 |
