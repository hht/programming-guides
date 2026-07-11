# 04 — CmsAdapter（供应商映射 · 可换）

## 不变量

- 领域代码只依赖 **CmsAdapter** 接口；供应商 SDK **不得**泄漏进 `features/` 状态机。  
- INPUTS §1 钉死**恰好一个**供应商；换商 = 新适配实现 + 映射表，Lifecycle 步骤名不变。  
- **Sanity / Contentful / Payload 是互斥映射选项，不是并行默认**；自建须填同等密度表。

## 适配器契约（实现自写）

```text
CmsAdapter:
  saveDraft(doc: ContentDocumentDraft)
    → { cms_document_id, status: draft }
  validate(doc) → { ok: true } | { ok: false, errors: ValidationIssue[] }
  publish(ref: { cms_document_id | slug, locale? })
    → { status: published, published_at }
  unpublish(ref) → { status: draft }   # 或 archived（INPUTS）
  fetchPublished(query: { slug | id, locale?, content_type })
    → ContentDocument | NotFound   # Delivery token only
  fetchPreview(query) → ContentDocument | NotFound  # Preview token / auth only
  # 可选：
  verifyWebhook(raw_body, headers, secret) → InvalidateEvent | SignatureError
```

## 步骤规格

1. 按 INPUTS 实现**一个**适配器；注册为唯一 `CMS_PROVIDER`。  
2. 填写下方对应映射表（未选用的供应商节标 N/A）。  
3. `fetchPublished` **只**使用 Delivery 凭据；`fetchPreview` **只**使用 Preview/鉴权路径。  
4. `validate` 可本地规则 + 供应商校验合流；**本地必填失败不得被供应商 200 覆盖为 ok**。

## Sanity 映射例（INPUTS §1=Sanity）

| 本册概念 | Sanity（例） |
|----------|--------------|
| saveDraft | 写入 mutation / 草稿文档；非 `published` 视角 |
| publish | 发布动作或 `published` 数据集可见 |
| fetchPublished | Content Lake **published** 视角 / CDN API + Delivery token |
| fetchPreview | draft 视角 + preview/draft 凭据 |
| webhook 失效 | 文档变更 webhook → 按 slug 失效缓存 |

## Contentful 映射例（INPUTS §1=Contentful）

| 本册概念 | Contentful（例） |
|----------|------------------|
| saveDraft | Management API 更新 Entry（draft） |
| publish | Management `publish` Entry |
| fetchPublished | **Content Delivery API** + delivery token |
| fetchPreview | **Content Preview API** + preview token |
| webhook 失效 | publish/unpublish webhook |

## Payload 映射例（INPUTS §1=Payload）

| 本册概念 | Payload（例） |
|----------|---------------|
| saveDraft | `draft: true` 创建/更新（跳过必填校验时仅写版本） |
| publish | 显式 `_status: 'published'`（`draft` 参数**不**等于发布） |
| fetchPublished | 查询须 **过滤 `_status = published`** + 公开可读策略；**禁止**假设「`draft:false` = 仅已发布」（从未发布的主行仍可能为 draft） |
| fetchPreview | `draft: true` / 最新版本 + 鉴权 |
| webhook 失效 | afterChange hook / webhook |

## 自建（INPUTS §1=自建 时必填）

| 本册概念 | API / 语义 |
|----------|------------|
| saveDraft / validate / publish / unpublish | （书面） |
| fetchPublished / fetchPreview | 基址 + 鉴权头 |
| draft 不可进公开 Delivery | 可验收谓词 |
| webhook（若启用） | 算法 + 事件名 |

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| Delivery 5xx / 超时 | `CMS_UNAVAILABLE`；公开面可展示降级/缓存（INPUTS）；**不**用 draft 顶替 |
| 401/403 Delivery | `DELIVERY_UNAUTHORIZED`；检查 token scope |
| 未知 webhook 事件 | 验签后 ignore |
| 映射表缺字段 | 投影失败；不假 published |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| fetchPublished 用 preview token 配置 | 架构/配置测试红灯或启动失败 |
| map publish → status published | 投影 status=`published` |
| fake adapter 跑 Lifecycle | `05` 单测绿 |
| 换商只改适配器 | Lifecycle 步骤名单测仍绿 |
