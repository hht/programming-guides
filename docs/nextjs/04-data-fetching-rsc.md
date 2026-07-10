# 04 — RSC 数据读取

## 不变量

- 默认在 Server Component `async` 读数据  
- 缓存：显式 `fetch` cache/revalidate 或 `unstable_cache`/tag；禁无文档的隐式假设  
- 错误：抛到 `error.tsx` 或返回空态 UI；禁静默空数据装成功  

## 步骤

1. `lib/` 封装数据访问（DB/HTTP）。  
2. page/layout `await` 调用；类型来自 Zod parse 或生成类型。  
3. 需用户态的读：在服务端读 cookie/session（`07`）。  
4. 仅高度交互列表用 Client + Query（INPUTS 明示）；默认不用。  

## 探针

| case | 期望 |
|------|------|
| 上游 500 | error UI，非空白假成功 |
