# 05 — Screen State Lifecycle（核心）

> **全文唯一核心正确性路径。**  
> route focus → load → UiState → 交互 → 失焦取消。

## 不变量

- 每个用户可感知状态变化 **只** 经本生命周期；禁止 Screen 旁路改业务真相。  
- UiState **单一不可变真相**（见 `03`）。  
- **失焦取消 inflight**（超越 a1，细则见 `07`）：blur 后旧请求结果不得写入 UiState。  
- 失败 **可展示、可测**：映射 INPUTS 错误码；禁止静默吞掉后假装 success。

## 步骤规格（编号钉死）

| # | 步骤 | 规格 |
|---|------|------|
| 1 | **Route focus** | 进入焦点（`useFocusEffect` / 等价 focus 订阅）。记录 `focusGeneration` 或创建本轮 `AbortController`。触发初次 `load` 或按 INPUTS 的「仅首次」。 |
| 2 | **Load** | 经 `onEvent(Enter\|Refresh)` 或 model 内 load；先发 `loading`（若矩阵需要）；调用 Repository，**传入 signal / 代次**。 |
| 3 | **写出 UiState** | 仅当本轮仍有效（未 abort、代次匹配）时 `set` **新不可变快照**；映射 success/empty/error/not-found。 |
| 4 | **交互** | 用户事件 → `onEvent` → 纯 reduce 或新一轮 load（仍带取消令牌）。导航副作用不进 Repository。 |
| 5 | **失焦取消** | blur / cleanup：`abort()` 或递增代次；忽略随后到达的响应；可选将 phase 保持离开前快照（默认：不强制清空为 loading）。 |
| 6 | **再 focus** | 按 INPUTS：重新 load 或保留缓存快照；若重新 load，新令牌，旧令牌已作废。 |

## 失败分类表

| 类 | 条件 | UiState / 导航 |
|----|------|----------------|
| `NETWORK` | 超时/无连接/abort 外的网络失败 | `error`；可 Retry |
| `UNAUTHORIZED` | 401/未登录 | error 或导航登录；禁假 success |
| `NOT_FOUND` | 详情缺失 | `not-found` |
| `VALIDATION` | 输入不合法 | 字段级错误进 UiState |
| `ABORTED` | 失焦取消 | **不**展示为 error；不覆盖 UiState（或按 INPUTS 保持原快照） |
| `UNKNOWN` | 未映射 | `error` 通用文案 |

## 伪代码（非实现）

```text
onFocus:
  controller = new AbortController()
  generation += 1
  gen = generation
  set uiState = { ...uiState, phase: Loading }   // 若矩阵需要
  result = await repository.load(params, controller.signal)
  if (aborted || gen != generation) return
  uiState = mapResult(result)

onBlur / cleanup:
  controller.abort()
  // generation 已足以作废晚到响应

onEvent(event):
  if pure: uiState = reduce(uiState, event)
  else: /* 同 onFocus 取消规则启动 IO */
```

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| focus → 成功 load | loading（若有）→ success/empty |
| focus → NETWORK | error + 码；非 success |
| blur 后响应到达 | UiState **不变**（不被旧响覆盖） |
| 快速 focus→blur→focus | 仅最后一轮结果生效 |
| Event → reduce 纯路径 | 新 UiState；无 IO |
| Retry 在 error 后 | 重新 load；带新令牌 |
| RNTL：error → Retry | 文案/角色符合矩阵 |
