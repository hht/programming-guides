# 08 — Read 与 Delete

## 不变量

- Lifecycle **步骤 4**；每次读/删仍须 **authorize**（不因「曾经上传过」永久放行他人）。  
- 默认读路径 = **短时 presign get**；禁止默认永久公开 URL。  
- 删 = 存储删除 + 应用元数据一致（或可重试补偿）。

## 4a. Read

1. 输入：主体 + `object_key`（或业务 object_id → 查 StoredObject）。  
2. 授权：主体可读该对象（owner / 分享策略 / 租户角色）；失败 → `object.forbidden`。  
3. 模式（INPUTS 钉 call site）：  
   - **presign get**（默认）：TTL = `PRESIGN_GET_TTL_SECONDS`（**默认 60**）  
   - **server get**：服务端流式转发（小文件、需审计包一层时）  
4. 不存在 → `object.not_found`（与 forbidden 分码，避免存在性泄漏时：INPUTS 钉「统一 not_found」或「真 forbidden」——**默认对无权限统一 `object.forbidden`**，对有权限但缺失用 `not_found`）。

## 4b. Delete

1. 授权删。  
2. `DeleteObject`。  
3. 应用侧：删/标记 `StoredObject`。  
4. 若仅一边成功：记录补偿任务（可选挂 workers-queue）；**禁止**静默忽略存储残留且无告警。

## 列表（可选）

- 应用 DB 列 StoredObject 为默认列表 SSOT。  
- **禁止**默认对终端用户暴露全桶 `ListObjects`；运维工具除外且不进产品必勾。

## 失败分类

| 情况 | 码 |
|------|-----|
| 无读/删权限 | `object.forbidden` |
| 有权但对象无 | `object.not_found` |
| 预签名失败 | `object.presign_failed` |
| 删存储失败 | `object.delete_failed`（可重试） |

## 单测探针

| case | 期望 |
|------|------|
| owner presign get | URL 可下载原字节 |
| 他者 get | forbidden；无 URL |
| TTL 后 get URL | 失效 |
| delete 后 get | not_found / 存储无对象 |
| 无 ListObjects 给终端 | 架构审查通过 |
