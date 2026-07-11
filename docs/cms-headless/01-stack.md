# 01 — 栈（钉死）

| 层 | 选择 |
|----|------|
| **领域模型** | 应用库 **ContentDocument + ContentStatus**（形状见 `03`）；状态机见 templates |
| **供应商接入** | **CmsAdapter** 薄适配（`04`）：saveDraft / validate / publish / unpublish / fetchPublished / fetchPreview；**映射例**按 INPUTS 择一（Sanity / Contentful / Payload / 自建） |
| **可换商** | INPUTS §1 钉死恰好一个；换商 = 换适配实现 + 字段映射表，**不**改 Lifecycle 步骤名 |
| **消费默认** | **Content Delivery API 只读**（公开）；Preview/Management 仅编辑路径与预览 |
| **HTTP 客户端** | 跟应用语言：TS → `fetch` 或官方轻客户端（**仅在适配器内**）；Go → `net/http`；Python → `httpx`/`requests` — **禁止**在 `features/` 直调 SDK |
| **禁止** | 指南钉死唯一不可换 SDK 百科；业务代码散落直调 CMS；公开路径混用 preview token |

禁止：留下「Sanity 或 Contentful 任选」双开口不写映射表；把某家 Dashboard/Studio 操作当唯一正确性路径。

## 脚手架

```bash
# 1) 复制 templates/content-status-matrix.md + content-document.schema.json 语义到实现仓
# 2) 实现 CmsAdapter（INPUTS §1 映射例见 04）
# 3) staging/prod：CMS_DELIVERY_TOKEN / CMS_PREVIEW_TOKEN（若用）/ project|space id 成对（值不入库）
# 4) 接线：draft → validate → publish → Delivery fetchPublished
# 5) 按 INPUTS §8 接 BFF / SSG / 客户端直调之一；§9 接 TTL 或 webhook 失效
```

## 版本

| 项 | 策略 |
|----|------|
| 供应商 Delivery / Management API | 跟 INPUTS 钉死的稳定主版本；升级须回归映射表与校验规则 |
| Sanity / Contentful / Payload（若选用） | 官方当前主线客户端**仅作适配器实现**，不进领域类型名 |
| 自建 | OpenAPI/JSON Schema 与 `03` 投影对齐；版本 bump = 契约变更 |

## 冲突裁决（写入 sources）

哪家 CMS 下载/口碑第一 **不**定默认；**先进边界** = 抽象 ContentDocument + Delivery/Preview 分离 + 发布前校验。流行 SDK 下载量不单独定胜负。
