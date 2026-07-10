# 04 — 数据获取（TanStack Query）

## 不变量

- 远程数据只进 Query cache（或 mutation 乐观更新后的 cache）  
- `queryKey` 只来自 `query-keys.ts`  
- `staleTime` 默认 **30_000** ms（全仓常量可改一处）；列表与详情 key 分离  

## 步骤规格

1. `QueryClient` 默认：`queries.retry: 1`；`mutations.retry: 0`。  
2. `api/client.ts`：`baseURL` 来自 env；统一解析错误为：

```text
AppError = {
  code: 'NETWORK'|'UNAUTHORIZED'|'VALIDATION'|'CONFLICT'|'UNKNOWN'
  // 若需扩展：必须先写入 INPUTS #10，禁止运行时发明
  messageKey: string
  fields?: Record<string, string>
  cause?: unknown
}
```

HTTP 422/400 + 业务校验 → `code=VALIDATION` 且尽量填 `fields`；409 → `CONFLICT`。  
3. 列表：`queryKeys.x.list(filters)`；详情：`queryKeys.x.detail(id)`；**必须**提供 `queryKeys.x.all` 供 `invalidateQueries({ queryKey: queryKeys.x.all })`（**禁止**另发明 `lists()` 前缀作为第二套约定）。  
4. 路由 `loader` **可选**：若用，须 `ensureQueryData`，与组件 `useQuery` 同 key。  
5. UI 四态（列表/集合资源钉死）：  
   - `pending`：`isPending`  
   - `error`：`isError`（可重试）  
   - `empty`：成功且 `Array.isArray(data) && data.length===0`（或 INPUTS 定义的空对象）  
   - `success`：成功且非 empty  
   **详情 404**：单独 `not-found` 态（非 empty）；展示「不存在」+ 返回列表，**不**用 empty 文案。  

## 单测探针

| case | 期望 |
|------|------|
| key 工厂稳定 | 同参同结构 |
| 401 映射 | AppError code UNAUTHORIZED |
| 列表 data=[] | UI empty，非 error |
| 详情 404 | not-found，非 empty |
