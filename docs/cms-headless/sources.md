# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| Contentful — Delivery / Preview / Management API 分界 | https://www.contentful.com/developers/docs/concepts/apis/ |
| Contentful — Draft & published | https://www.contentful.com/developers/docs/concepts/draft-and-published/ |
| OWASP API Security Top 10（对象级授权 / 安全消费） | https://owasp.org/API-Security/ |

## 标杆 B（开源 P1 + P1w 补足 = 3）

| ID | 仓库或文档 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------------|------|--------|----------|--------------|
| A | [Payload — Drafts](https://payloadcms.com/docs/versions/drafts)（仓：[payloadcms/payload](https://github.com/payloadcms/payload)） | P1 | `_status` draft/published、草稿保存与发布、公开读须过滤 published | 绑死 Payload Admin 安装百科或 Next 整站目录 | 编辑草稿并发布后经 API 消费 |
| B | [Strapi — Draft & Publish](https://docs.strapi.io/cms/features/draft-and-publish) + [REST status](https://docs.strapi.io/cms/api/rest/status)（仓：[strapi/strapi](https://github.com/strapi/strapi)） | P1 | Draft & Publish、REST 默认 published、draft 须显式 status | 抄 Strapi 插件市场当本册主体；运维安装教程 | 草稿/发布与公开 Content API |
| C | [Contentful — APIs](https://www.contentful.com/developers/docs/concepts/apis/) + [Draft & published](https://www.contentful.com/developers/docs/concepts/draft-and-published/) | P1w | Delivery vs Preview vs Management、draft 不进 CDA | 绑死 Contentful 为唯一商；堆 SDK 百科 | 公开 Delivery 只读已发布内容 |

映射学习（非 B 共有证据源、不钉唯一默认）：[Sanity Content Lake / API](https://www.sanity.io/docs/content-lake) — 仅当 INPUTS 选 Sanity 时对照 published 视角与 token；[Directus](https://github.com/directus/directus) — 自建/其它对照。

## 共有能力切条（用户可感知）

> 仅切**用户可感知**能力（编辑者或访客能判断成败）。Studio 安装步骤、SDK 目录、APM **不进**共有必做。

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 保存草稿且不对公开访客展示 | ✓ | ✓ | ✓ | **必做** |
| 发布前有字段/必填类约束（失败不可当已发布） | ✓ | ✓ | ✓ | **必做** |
| 发布后经公开 Delivery/Content API 可读 | ✓ | ✓ | ✓ | **必做** |
| 取消发布 / 撤回后公开不可读 | ✓ | ✓ | ✓ | **必做** |
| Studio/Admin 可视化编辑 | ✓ | ✓ | ✓ | **参考**（不进必勾；非本册钉死面） |
| 多供应商同时双写 | — | — | — | **禁止** |

> **共有必做**仅上表用户可感知且 ≥2 源证据的能力。Delivery/Preview 凭据硬分离、应用侧 ContentDocument 投影、publish 前强制 validate 合流 **不进共有**（演示流常更弱）→ 见超越与 `11` §C。

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做/可选/参考 |
|------|------|------|------|----------------|
| Content Publish Lifecycle 编号步骤 | A,B,C | 功能 | `05` | 必做 |
| ContentDocument 投影模型 | 超越 a2 | 工程 | `03` | 必做/超越 |
| CmsAdapter；供应商互斥映射 | C 完备 vs 禁百科 | 工程 | `04`/`01` | 必做 |
| draft + validate 硬门闸 | A,B,C + 超越 a1 | 功能 | `06` | 必做 |
| publish / unpublish + 缓存契约 | A,B,C | 功能 | `07` | 必做 |
| Delivery 只读消费 | C + A,B API | 功能 | `08` | 必做 |
| Studio 安装百科 / 唯一商默认 | — | — | — | **禁止** |
| CMS Dashboard / APM | 各 | 参考 | — | 参考 |

## 冲突记录

| 冲突 | 裁决 |
|------|------|
| 哪家 CMS 口碑/下载第一 | **不**定默认；**INPUTS 互斥钉恰好一家**；指南钉 Document + Adapter + Delivery 消费 |
| Studio UI vs 应用正确性路径 | **Lifecycle + Delivery 消费**为本册正确性路径；Studio 仅参考 |
| 同一 token 读 draft+published | **禁止**用于公开路径；Preview 与 Delivery 分离 |
| CMS JSON 当页面模型 | **禁止**；须投影为 ContentDocument |
| Payload `draft:false` 仍可能读到从未发布的 `_status:draft` | **fetchPublished 必须过滤 published**（见 `04`/`08`）；不得假设「非 draft 参数 = 仅已发布」 |
| Strapi REST 无直接 unpublish | Adapter 须经 Document Service / 自定义路由实现；**不**因此删掉本册 unpublish 必做 |
| Sanity 文档未进 B 三源 | 仅 INPUTS 选 Sanity 时作映射学习，不升格为第四共有源 |
