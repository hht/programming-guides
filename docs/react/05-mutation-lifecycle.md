# 05 — Mutation Lifecycle（核心正确性路径）

## 不变量

全文唯一主路径：`路由 → Query → 渲染 → Zod → Mutation → 缓存收敛 → UI`。  
远程实体列表/详情 **禁止** 进 Zustand（与 `00` 一致）。

超越：

1. `对照：B 中未见「远程实体列表禁止进客户端全局 store」硬门闸 → Query SSOT`  
2. `对照：B 中更弱/未见「await invalidate 后再 navigate」硬顺序 → 本指南要求该顺序 + e2e#2`

## 步骤规格

1. 用户打开路由 → `useQuery`（**默认**；全仓统一，不用 Suspense 除非 INPUTS 声明）。  
2. 渲染四态：`pending` / `error` / `empty` / `success`（与 `04` 一致）。  
3. 用户提交：RHF + `zodResolver(schema)`；`schema` 在 `api/schemas/`；与请求体同一 Zod。  
4. `useMutation`：  
   - `mutationFn` 只调 `api/client`  
   - `onSuccess` **钉死顺序**：  
     1. `await queryClient.invalidateQueries({ queryKey: queryKeys.x.all })`  
        **或** 对同一实体 `setQueryData` 写完最终值（二选一；选 setQueryData 则单测断言 setQueryData 而非 invalidate）  
     2. 若 INPUTS 要求跳转：再 `navigate(...)`  
     **禁止**未 await invalidate 就 navigate（避免列表页读到旧 cache）  
   - `onError`：  
     - `VALIDATION` + `error.fields` → `form.setError(path, { message: t(key) })`  
     - 无 `fields` → form root 或 toast `messageKey`  
     - 其它 code → toast  
5. 进行中：`disabled={isPending}`；mutation 未结束禁止再 fire。  

## 乐观更新（可选）

若做：完整 `onMutate` 快照 / `onError` 回滚 / `onSettled` invalidate。不做则禁止半套。

## 失败分类

| 情况 | 行为 |
|------|------|
| Zod 失败 | 不发请求；字段错误 |
| VALIDATION | 映 `fields`；无 fields 则 root |
| NETWORK | toast；可再提交 |
| 401 | 清会话 → login |
| CONFLICT(409) | 专用文案；可选 refetch |

## 单测探针

| case | 期望 |
|------|------|
| 列表 data=[] | empty 帧 |
| 详情 404 | not-found，非 empty |
| 成功 | 单测：`invalidateQueries` 被 await；若有 navigate，mock 显示 navigate 在其后调用 |
| e2e（见 09#2） | 成功反馈 + 列表/详情含新数据（覆盖「收敛后可见」，不在本文件重复写 Playwright） |
| Zod 挡提交 | mutationFn 未调 |
| VALIDATION+fields | 对应 path setError |
| isPending | 无双提交 |
