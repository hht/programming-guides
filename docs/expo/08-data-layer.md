# 08 — 数据层

## 不变量

- **Repository** 是数据边界：HTTP / SecureStore / 文件细节不泄漏进 Screen。  
- 异步结果在 Screen model 内收敛为 UiState（`05`）；禁止 route 文件 `fetch` 后本地 state 当真相。  
- 错误映射为 INPUTS 错误码；禁止未映射异常冒充 success。  
- Token 存放遵守 INPUTS §6；**禁** AsyncStorage 明文存会话。

## 步骤规格（实现自写）

1. **接口**  
   - `XxxRepository` 方法按业务操作命名（Pass1）；接受可选 `AbortSignal`；返回 `Result` / 判别联合 + 错误码。  

2. **实现**  
   - `fetch` 或类型安全客户端择一钉死；超时/基 URL 来自环境。  
   - 将 `signal` 传入 `fetch`；abort → 向上表现为 `ABORTED` 或抛可由 model 识别的 Abort。  

3. **存储**  
   - 会话：SecureStore（或 INPUTS 书面等价）。  
   - 偏好/缓存：策略写 INPUTS §18（若有）。  

4. **与 auth**  
   - 401 → `UNAUTHORIZED`；清会话对齐 auth 册，不发明第二套。

5. **原生调用**  
   - 仅经 §10 已批准模块；包装在 `data/` 或 `core/lib`，不进 JSX。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 超时 | `NETWORK` |
| HTTP 401 | `UNAUTHORIZED` |
| HTTP 404 | `NOT_FOUND` |
| 4xx 校验 | `VALIDATION`（可带 fields） |
| 5xx / 解析失败 | `UNKNOWN` 或 `NETWORK`（钉死一种） |
| Abort | `ABORTED`（见 `07`） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| Repository 成功 | model → success UiState |
| 假 401 | UNAUTHORIZED 路径 |
| signal abort | 不 resolve 成 success 写回 |
| 错误码表 | HTTP→码映射单测齐全 |
