# 06 — 表单与 UI（Zod / RHF / shadcn）

## 不变量

- 表单：`react-hook-form` + `zodResolver`  
- 可视组件：优先 `components/ui/*`（shadcn）；**业务组合只放 `features/<domain>/`**（禁再堆进 `components/` 除 `ui`/`layout`） 
- 用户可见文案走 i18n/messages；shadcn 示例英文须替换  

## 步骤规格

1. `pnpm dlx shadcn@latest add form input button …` 按 INPUTS 需要。  
2. `fooSchema = z.object({...})`；`type FooInput = z.infer<typeof fooSchema>`。  
3. `useForm({ resolver: zodResolver(fooSchema), defaultValues })`。  
4. 提交：`handleSubmit(onValid)` → mutation。  
5. 日期字段：存 ISO 字符串或 `Date` 须在 schema 钉死；展示用 `date-fns` `format`。  
6. 列表工具：排序/去重/分组用 **es-toolkit**（`sortBy`/`uniqBy` 等），禁止手写脆弱深比较除非必要。  
7. Toast：sonner（shadcn）；成功/失败各一处封装，禁散落。  

## 失败分类

| 情况 | 行为 |
|------|------|
| 缺 shadcn 组件 | 先 `shadcn add`，禁从 CDN 拉运行时 |
| 双 schema | FAIL；合并为一 |

## 单测探针

| case | 期望 |
|------|------|
| 缺必填 | 错误信息可见；无请求 |
| 合法提交 | mutation 收到 parse 后数据 |
