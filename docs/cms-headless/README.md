# Headless CMS — 内容发布集成边界指南

> **这是工程指南，不是半成品项目。** 
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **Headless CMS 集成边界**：草稿 → 校验 → 发布 → **Content Delivery API 消费**。 
> **默认栈**：**抽象 ContentDocument + ContentStatus（应用库为本仓真相）** + **CmsAdapter 薄适配** + **Delivery 只读消费契约**；供应商由 INPUTS **互斥任选一家**（Sanity / Contentful / Payload / 自建）。**禁止**将本册写成某家 CMS 安装 / Studio / Admin 百科；**写明面 = Content Delivery API 消费与发布门闸**，不是 CMS 产品全功能目录。 
> **对齐**（可选挂接）：[nextjs](../nextjs/README.md) · [react](../react/README.md) · [go](../go/README.md) · [fastapi](../fastapi/README.md)（应用册保留路由/页面 SSOT；**Content Publish Lifecycle 以本册为准**）。 
> **来源**：[sources.md](./sources.md)

## 品类一句话

编辑者保存草稿并在校验通过后发布；公开面只经 **Content Delivery API** 消费已发布内容；草稿默认对公开 Delivery **不可见**。

## 核心正确性路径

**Content Publish Lifecycle**（[05](./05-content-publish-lifecycle.md)）：

`draft → validate → publish → consume API`（编号步骤）。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；CMS 供应商互斥已约定 
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`） 
3. [03](./03-content-document-model.md) / [04](./04-cms-adapter.md) / [05](./05-content-publish-lifecycle.md) 
4. [06](./06-draft-and-validate.md) / [07](./07-publish-and-unpublish.md) / [08](./08-delivery-api-consume.md) 
5. 若对接应用册：应用册保留页面/路由 SSOT；**发布与 Delivery 消费以本册为准** 
6. [commands.md](./commands.md) `check` 绿 
7. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者） 

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；供应商互斥 / schema / token / 缓存 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-content-document-model.md) | ContentDocument / 字段契约 |
| [04](./04-cms-adapter.md) | CmsAdapter；供应商映射例 |
| [05](./05-content-publish-lifecycle.md) | **Content Publish Lifecycle（核心）** |
| [06](./06-draft-and-validate.md) | 草稿与发布前校验 |
| [07](./07-publish-and-unpublish.md) | 发布 / 撤回边界 |
| [08](./08-delivery-api-consume.md) | Content Delivery API 消费 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/P1w/差距表 |
| [templates](./templates/README.md) | schema / env / 状态矩阵例 |
