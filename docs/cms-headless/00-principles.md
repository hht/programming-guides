# 00 — 原则与不变量

## 品类

编辑者保存草稿并在校验通过后发布；公开面只经 **Content Delivery API** 消费已发布内容；草稿默认对公开 Delivery **不可见**。

## 核心正确性路径（全文唯一）

**Content Publish Lifecycle**：**draft → validate → publish → consume API**。规格见 [05](./05-content-publish-lifecycle.md)。草稿/校验见 `06`；发布/撤回见 `07`；Delivery 消费见 `08`——**不替代**本路径名。

## 硬不变量

1. **应用侧 ContentDocument.status 为业务发布真相**（或与 CMS published 标志经适配器**单向映射**后的投影）；禁止前端「本地假发布」冒充 `published`。 
2. **公开 Content Delivery 路径不得返回 draft**；预览须独立凭据或鉴权会话（INPUTS §4/§10）。 
3. **publish 必须先过 validate**；校验失败 → 保持 `draft`（或不离开可编辑态），错误对编辑者可见。 
4. **CMS 文档 id 仅为外部引用**（`cms_document_id`）；业务主键 / slug 属应用词表。 
5. **供应商互斥**：INPUTS 择一家；换商 = 换 CmsAdapter 映射，**不**改 Lifecycle 步骤名。 
6. **消费面约定 Delivery**：本册必做 = Delivery 只读消费契约 + 发布门闸；**禁止**把 Studio/Admin 安装百科、插件市场教程当正文 SSOT。 
7. **deletion-first**：无平行第二套「内容状态枚举」；无 `*CmsManager` 领域主名；领域代码不散落直调多家 SDK。 
8. **缓存不得延长「已撤回仍可见」超过 INPUTS TTL/失效契约**（见 `08`）。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 供应商 / token 名 / type 清单 / 缓存策略 | `INPUTS.md` |
| ContentDocument / 字段形状 | `03-content-document-model.md` + templates |
| 供应商适配与映射 | `04-cms-adapter.md` |
| Lifecycle 步骤 | `05-content-publish-lifecycle.md` |
| 草稿与校验 | `06-draft-and-validate.md` |
| 发布 / 撤回 | `07-publish-and-unpublish.md` |
| Delivery 消费 / 缓存 | `08-delivery-api-consume.md` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止

- 指南仓堆可运行 CMS Studio / 全量 SDK 教程 
- 公开 API 用 preview token 或返回 draft 正文 
- validate 失败仍写 `published` 
- 「Sanity 且 Contentful」双 SSOT 
- 把本册写成「仅装 Payload/Strapi」运维百科 

## 超越（对照写入 11）

1. `对照：B 中部分演示流用同一 token 读 draft+published 或未强制发布前校验 → 本指南要求 Delivery/Preview 凭据分离，且 publish 必须先过 validate（见 05/06/08）` 
2. `对照：B 中常把 CMS 原始 JSON 直接当页面模型 → 本指南强制经 CmsAdapter 投影为应用 ContentDocument，SDK 类型不进 features/ 状态机（见 03/04/08）` 
