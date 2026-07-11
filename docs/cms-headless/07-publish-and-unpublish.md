# 07 — 发布与撤回

## 不变量

- **publish** 仅从通过 validate 的 draft（或等价已校验版本）进入 `published`。  
- **unpublish / 撤回** 默认：`published → draft`（或 INPUTS 的 `archived`）；公开 Delivery 在 TTL/失效契约内不可再读到正文。  
- 发布成功须触发 **缓存失效或接受 TTL 上限**（INPUTS §9）；禁止无限期展示已撤回内容。

## 步骤规格（实现自写）

### Publish

1. 鉴权：编辑者具备 `content:publish`（或等价）权限码（INPUTS 钉）。  
2. 同请求 `validate` → `adapter.publish`。  
3. 记录 `published_at` / `published_by`（若审计需要）。  
4. `invalidate(slug|id|locale)`：webhook 路径见下；纯 TTL 则文档化最大延迟。

### Unpublish

1. 鉴权同或更严。  
2. `adapter.unpublish`；状态 → `draft` 或 `archived`。  
3. 立即失效公开缓存键；随后 `fetchPublished` 须 NotFound。  
4. **供应商缺口**：若 REST 无 unpublish（例 Strapi 须 Document Service / 自定义路由），仍须在适配器内实现等价语义；**禁止**因 SDK 缺端点而删掉本册撤回必做。

### Webhook 失效（INPUTS §9/§12 启用时）

1. 保留原始 body；验签失败 → 4xx；**零**缓存删除/状态写。  
2. 验签成功 → 解析 slug/id → purge。  
3. 未知事件 → ignore。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 未校验发布 | 拒 |
| 已 published 再 publish | 幂等 no-op（默认） |
| unpublish 时 CMS 挂 | `CMS_UNAVAILABLE`；可标 `unpublish_pending`（可选）但仍须可观测；禁止假装已对公开隐藏却 Delivery 仍 200 超 TTL |
| 坏签 webhook | 不 purge |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| publish 快乐路径 | status=published；Delivery 可读 |
| unpublish | Delivery 404；状态 draft/archived |
| 坏签 webhook | 缓存键仍在（或未误删其它键） |
| 无权限 publish | 401/403 |
