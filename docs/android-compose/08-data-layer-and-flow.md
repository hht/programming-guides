# 08 — 数据层与 Flow

## 不变量

- **Repository** 是数据边界：网络 / DB / DataStore 细节不泄漏进 Screen。  
- 异步默认 **Coroutines + Flow**；UI 层收敛为 UiState（`05`），不在 Composable 里 `collect` 原始网络 Flow 当真相（可在 ViewModel 内转换）。  
- 错误映射为 INPUTS 错误码；禁止对 UI 抛未映射异常冒充 success。  
- 鉴权 token 存放遵守 INPUTS §5；**禁**明文 SharedPreferences 存会话。

## 步骤规格（实现自写）

1. **接口**  
   - `XxxRepository` 方法按业务操作命名（Pass1）；返回 `Result` / 密封结果或领域类型 + 错误码。  

2. **实现**  
   - 网络客户端一种钉死（`01`）；超时/基 URL 来自环境。  
   - 可选 Room：实体词表名；缓存失效策略写 INPUTS §14。  

3. **Flow 用法**  
   - 观察型数据：`Flow` → ViewModel `stateIn` / 收集后 `copy` 进 UiState。  
   - 单次：`suspend`；ViewModel 用代次避免乱序。  

4. **线程**  
   - IO 在 `Dispatchers.IO`（或注入 Dispatcher）；主线程只更新 UiState。  

5. **与 auth**  
   - 401 → 码 `UNAUTHORIZED`；清会话策略对接 auth 册，不在本册发明第二套。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 超时 | `NETWORK` |
| HTTP 401 | `UNAUTHORIZED` |
| HTTP 404 | `NOT_FOUND` |
| 4xx 校验 | `VALIDATION`（可带 fields） |
| 5xx / 解析失败 | **`UNKNOWN`**（默认）；映射表可扩但须写入词表 |
| 磁盘满 / DataStore 失败 | 按 INPUTS；默认 error 可展示 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| Repository 成功 | ViewModel → success UiState |
| 假 401 | UNAUTHORIZED 路径 |
| Flow 发射序列 | Turbine 断言顺序 |
| Dispatcher | 单测可替换；无主线程假 IO |
