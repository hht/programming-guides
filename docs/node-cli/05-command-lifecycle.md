# 05 — Command Lifecycle（核心正确性路径）

## 不变量

全文唯一主路径：**parse → route → render → task → unmount →（cli 写 stdout）→ 进程结束**。

超越对照：

1. `对照：B/A 常见「交互中失败只打日志」更弱 → 失败必映射 exit 表 + stderr \`ERROR:<CODE>\`` 
2. `对照：多数 README 未约定 stdout 时机 → 机器结果仅在 \`await app.run()\` 之后写出`

## 步骤规格

1. **parse / route**：Pastel + Zod（`03`）。 
2. **preflight**：`commands`/`services` 读 `config`；缺密钥 → `exitCode=2` 或鉴权失败码 + stderr → `useApp().exit()`。 
3. **render**：只返回 Ink 树；勿第二层 `render()`。 
4. **task**：domain 纯函数；services 接 `AbortSignal`；Esc/SIGINT/SIGTERM → `abort` → 清理 → `exitCode=130` → `useApp().exit()`；**取消不写 `ERROR:`**。 
5. **成功终局**： 
 1. `setMachineResult(payload)` — 签名：`setMachineResult(payload: unknown): void` / `takeMachineResult(): unknown | null`（take 后清空） 
 2. `process.exitCode = 0` 
 3. `useApp().exit()` 
5b. **取消接线（最小）**：组件内 `const ac = useRef(new AbortController())`；`useInput((input, key) => { if (key.escape) { ac.current.abort(); … exit 130 } })`；`useEffect(() => { const onSig = () => ac.current.abort(); process.on('SIGINT', onSig); process.on('SIGTERM', onSig); return () => { process.off('SIGINT', onSig); process.off('SIGTERM', onSig); }; }, [])`；services 一律接 `ac.current.signal`。 
6. **`cli.ts` 收尾**：

```text
const app = new Pastel({ importMeta: import.meta });
await app.run();
const payload = takeMachineResult();
if (payload != null) {
 process.stdout.write(formatPerINPUTS(payload)); // 例：JSON.stringify(payload)+'\n'
}
process.exitCode ??= 0;
```

7. **失败终局**：`exitCode=1|2` → stderr `ERROR:<CODE> msg` → `useApp().exit()` → 不 `setMachineResult`。

## 状态机

```text
idle → loading → success → (setResult + exitCode0 + exit → cli write stdout)
 ↘ error → (exitCode1 + ERROR:CODE + exit)
 ↘ cancelled → (exitCode130 + exit，无 ERROR:)
```

## 失败分类 / 默认值

| 情况 | exitCode | stderr |
|------|----------|--------|
| Esc / SIGINT / SIGTERM | 130 | 可选短提示，**无** `ERROR:` |
| 业务失败 | 1 | `ERROR:<CODE> …` |
| 用法/校验/非 TTY | 2 | 必须 `ERROR:USAGE …`（统一前缀） |
| 部分成功 | 按 INPUTS §11；未勾选则当失败 1 | 按勾选 |

## 单测探针

| case | 期望 |
|------|------|
| 成功 | setResult 被调；模拟 `take` 后字符串符合 INPUTS schema |
| 失败 | exitCode 1；`ERROR:[A-Z0-9_]+`；take 为空 |
| 取消 | exitCode 130；stderr 无 `ERROR:` |
