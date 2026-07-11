# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：随宿主应用册 Language Gate（本册不另开语言百科；实现语言的 fmt/lint 跟宿主 `commands`）。

## 品类

编辑者保存草稿并在校验通过后发布；公开面只经 Content Delivery API 消费已发布内容。

## 核心正确性路径（全文唯一）

**Content Publish Lifecycle**：draft → validate → publish → consume API。规格见 [05](./05-content-publish-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | ContentDocument.status 为发布真相（或单向映射投影） | `03`/`05` |
| F02 | MUST NOT | 前端本地假发布冒充 published | e2e |
| F03 | MUST NOT | 公开 Delivery 返回 draft | `08` |
| F04 | MUST | publish 必须先 validate | `06`/`05` |
| F05 | MUST | CMS id 仅为外部引用 | `03` |
| F06 | MUST | 供应商互斥；换商换适配不改 Lifecycle 名 | INPUTS/`04` |
| F07 | MUST | 本册必做=Delivery 契约+发布门闸 | `08` |
| F08 | MUST NOT | 缓存延长已撤回可见超过契约 TTL | `08` |
| F09 | MUST | deletion-first；领域不散落直调多家 SDK | 目录 |

## SSOT

| 真相 | Owner |
|------|--------|
| 供应商 / token / type / 缓存 | `INPUTS.md` |
| ContentDocument | `03` + templates |
| 适配器 | `04` |
| Lifecycle | `05` |
| 草稿与校验 | `06` |
| 发布/撤回 | `07` |
| Delivery / 缓存 | `08` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md` |
