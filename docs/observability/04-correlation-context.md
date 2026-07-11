# 04 — Correlation Context 传播

## 不变量

- 每个入站可诊断请求进入后，上下文中存在 **`correlation_id`**（及启用 traces 时的 span context）。  
- **跨边界**（HTTP/RPC/消息）必须 **inject**；入站必须 **extract**；丢失传播 = 关联链断裂（探针红）。  
- HTTP 默认同时支持 **W3C `traceparent`**；与 `correlation_id` 关系按 INPUTS §2。

## 步骤规格（实现自写）

1. **入站 extract**  
   - 读 `traceparent`（若有）→ 恢复/继续 trace。  
   - 读应用相关头（默认 `X-Correlation-Id`）；若无则 **生成**（UUIDv4 或等熵）并写入 context。  
2. **挂到请求上下文**  
   - 语言惯例：Go `context.Context`；TS AsyncLocalStorage/请求对象；Python contextvars — **禁**仅放全局可变单例当默认。  
3. **出站 inject**  
   - 下游 HTTP/RPC：写入 `traceparent` +（若 INPUTS 要求）`X-Correlation-Id`。  
4. **消息 / 异步**  
   - 入队时序列化 correlation / trace context 到消息元数据；消费者 extract 后再 emit。  
5. **对外回显**  
   - 按 INPUTS §7：默认响应头 `X-Correlation-Id: <id>`（错误与成功均可；至少错误路径必有）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 入站无任何 id | **生成新** `correlation_id`；不拒绝请求 |
| `traceparent` 非法 | 忽略坏头并新开 trace（记录 debug）；仍保证有 correlation_id |
| 出站忘 inject | 单测/契约探针失败 |
| 回显策略选「仅内部」 | 须另有支持渠道可取 id；否则 INPUTS 不合格 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 无头入站 | 响应（或日志）含新 correlation_id |
| 带 X-Correlation-Id 入站 | 出站/日志同值 |
| 带合法 traceparent | 子 span 共享 trace_id |
| 出站头 | 含 traceparent（若 traces 启用） |
