# 05 — Content Publish Lifecycle（核心）

## 不变量

- 全文唯一核心路径名：**Content Publish Lifecycle**。  
- 顺序钉死：**draft → validate → publish → consume API**。  
- **公开消费权威 = Delivery 上的 published 投影**；本地 UI「已保存」**不得**单独冒充已对访客可见。  
- 状态转移为纯函数 + 适配器写；非法边拒绝（见 [templates/content-status-matrix.md](./templates/content-status-matrix.md)）。

## 步骤规格（实现自写）

### 1. Draft

1. 鉴权（编辑者 Session Gate / CMS 写凭据仅服务端）。  
2. 组装 `ContentDocumentDraft`（`03`）；`status` 目标为 `draft`。  
3. 调 `CmsAdapter.saveDraft`；写回 `cms_document_id`。  
4. 供应商失败 → `CMS_UNAVAILABLE`；**不**把本地假草稿标为已发布。

### 2. Validate

1. 对当前草稿跑 `CmsAdapter.validate`（含 INPUTS §6 规则表）。  
2. 失败 → 返回 `CONTENT_VALIDATION_FAILED` + issue 列表（编辑者可见）；**禁止**进入步骤 3。  
3. 成功 → 可短暂标记 `validated` 中间态（可选）或直接允许 publish 命令。

### 3. Publish

1. 仅当 validate 已通过（同请求内先 validate，或显式「已校验版本」戳；默认 **同请求内先 validate**）。  
2. 调 `CmsAdapter.publish`；落库/投影 `status = published` + `published_at`。  
3. 触发缓存失效（webhook 或主动 purge；见 INPUTS §9）。  
4. 重复 publish 已 published → 幂等 no-op 或 `CONTENT_ALREADY_PUBLISHED`（INPUTS 钉死一；默认 **幂等 no-op**）。

### 4. Consume API

1. 公开路径只调 `CmsAdapter.fetchPublished`（Delivery token）。  
2. 投影为应用 `ContentDocument`；渲染 / API 响应。  
3. `NotFound` / 非 published → `CONTENT_NOT_FOUND` 或 `CONTENT_NOT_PUBLISHED`（对外可统一 404；对内区分）。  
4. Preview 路径（编辑者）用 `fetchPreview`；**禁止**与公开路由共用实现且误绑 preview token。

### 伪代码（规格级）

```text
save_draft(cmd):
  row = project(cmd)
  ext = adapter.saveDraft(row)
  save(cms_document_id = ext.cms_document_id, status = draft)
  return row

publish(cmd):
  v = adapter.validate(load_draft(cmd.ref))
  if not v.ok: return CONTENT_VALIDATION_FAILED
  adapter.publish(cmd.ref)
  set status = published
  invalidate_cache(cmd.ref)

consume_public(slug, locale):
  doc = adapter.fetchPublished({ slug, locale })  # delivery token ONLY
  if missing: return 404
  return project(doc)
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| draft 保存时 CMS 挂 | 不 published；`CMS_UNAVAILABLE` |
| validate 失败 | 保持 draft；编辑者可见 errors |
| publish 时竞态已被撤回 | 拒或重读再判；不假成功 |
| 公开 consume 命中仅有 draft | 404 / `CONTENT_NOT_PUBLISHED`；**不**回退 draft 正文 |
| 缓存仍有旧 published | ≤ INPUTS TTL 可接受；超 TTL 须可测失败 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 快乐路径 | draft→validate ok→publish→fetchPublished 得正文 |
| validate 失败仍调 publish | 拒；仍 draft；Delivery 无新正文 |
| 公开 fetch 在仅 draft 时 | 404 / NOT_PUBLISHED |
| preview fetch 可见 draft | 仅 preview/鉴权路径 |
| 重复 publish | 幂等；仍 published |
| 非法边 published→未校验直改字段当已发布 | 转移/路径拒绝 |
