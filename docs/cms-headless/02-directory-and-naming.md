# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
# 实现仓建议落点（按应用册微调；词根不变）
features/content/
 draft/ # 保存草稿
 validate/ # 发布前校验（可纯函数）
 publish/ # 发布 / 撤回命令
 delivery/ # 公开消费（BFF/loader）
internal/cms/ # 或 src/shared/cms/
 cms-adapter.* # 薄适配；禁 CmsManager 作领域主名
 content-status.* # 纯函数转移（可测）
 project-content.* # CMS JSON → ContentDocument 投影
ops/
 cms.md # 可选：token 轮换 / webhook 说明（非 APM 必勾）
```

依赖方向：`features/content → cms-adapter → 供应商 SDK/HTTP`；`delivery → fetchPublished → 投影 → UI/页面模型`。 
**禁** 页面组件内直调 Sanity/Contentful/Payload SDK 绕过适配器与状态机。

UI 状态：编辑 / 预览 / 公开页状态名必须用 Pass1 词表（见 `07`/`08`）。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建或更新 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。 
2. **ContentDocument、Draft、Publish、Delivery、Preview** = 业务词根；禁 `CmsDto`、`SanityThing`、`handleContent*` 进领域主模块名。 
3. **禁**技术翻译名：`*CmsManager`、`*ContentService`、`*DeliveryHelper`（基础设施可用 `CmsAdapter` / `DeliveryClient` 入口例外）。 
4. **禁**同义词分叉：`draft`/`unpublished`/`wip` 只留 **`draft`**；成功上线 = **`published`**；撤回后回编辑 = **`draft`**（或显式 `archived` 若 INPUTS 启用，须一词一义）。供应商原始状态名只出现在适配器映射表。 
5. 对外协议字段（document id、slug、status、locale、updated_at）冻结在词表。

| 概念 | 正例 | 反例 |
|------|------|------|
| 实体 | `ContentDocument`、`ContentType` | `CmsDto`、`EntryWrapper`、`SanityDoc` |
| 操作 | `saveDraft`、`validate`、`publish`、`unpublish`、`fetchPublished` | `handleSanity`、`processEntry`、`doSync` |
| 状态 | `draft`、`published`、`archived`（可选） | `ok`、`live`、`online`、`cms_done` |
| 外部引用 | `cms_document_id` | 把 CMS id 当唯一业务主键到处散落 |
| 消费 | `Delivery`、`Preview` | `getStuff`、`loadCmsRaw` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| 表名（若有应用投影表） | `content_documents`；列 `snake_case` |
| 路由 | `/content/drafts`、`/content/publish`、`/content/:slug`（或应用册惯例）；全文一种 |
| 环境变量 | `CMS_PROVIDER`、`CMS_DELIVERY_TOKEN`、`CMS_PREVIEW_TOKEN`、`CMS_PROJECT_OR_SPACE_ID`、`CMS_WEBHOOK_SECRET` |
| Go 导出 | `PascalCase`；TS/Python 跟应用册 |
