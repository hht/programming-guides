# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写 CMS 集成实现**。  
**禁止**空「其它」：凡写「其它 / 自建」须带书面理由 + 可验收谓词（Delivery 基址、token 形态、draft/publish 语义、错误码）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **CMS 供应商（互斥钉死恰好一家）** | □ **Sanity** □ **Contentful** □ **Payload** □ **自建**（须钉：Delivery 基址 + Management/写 API 或等价写路径、draft vs published 语义、preview 凭据名）。**禁止**「Sanity 或 Contentful 任选」双开口；**禁止**并行两家作 SSOT；**禁止**把某家 SDK / Studio 教程当指南唯一默认却不写适配边界 |
| 2 | **Content type 清单** | ≥1 个对外类型（例 `page` / `article` / `faq`）；每类型：必填字段、slug/id 规则、本地化策略（□ 单语 □ 多 locale 列表） |
| 3 | **应用侧 ContentDocument 主键** | 业务 id 或稳定 `slug`（钉死一）；CMS 文档 id 仅为 `cms_document_id` 外部引用 |
| 4 | **Delivery / Preview 凭据分离** | staging/prod **成对**：`CMS_DELIVERY_TOKEN`（公开只读）与可选 `CMS_PREVIEW_TOKEN`（草稿/预览）；**禁止**把 preview 凭据下发到公开前端 bundle |
| 5 | **环境成对** | staging/prod：`APP_ENV`、`CMS_PROJECT_OR_SPACE_ID`（或等价）、Delivery base URL、token 名、webhook secret（若启用）；**值不入库** |
| 6 | **校验规则表** | 发布前必跑：必填字段、slug 唯一（作用域钉死）、引用完整性（至少列出「悬空引用」策略：拒发布 / 允许+告警） |
| 7 | **错误码表** | 至少：`CONTENT_NOT_FOUND` / `CONTENT_VALIDATION_FAILED` / `CONTENT_NOT_PUBLISHED` / `CONTENT_ALREADY_PUBLISHED` / `CMS_UNAVAILABLE` / `DELIVERY_UNAUTHORIZED` → HTTP/应用映射 |
| 8 | **公开消费形态（互斥钉死一）** | □ **服务端 BFF 拉 Delivery 再渲染**（默认）□ **构建时拉取（SSG）**□ **客户端直调 Delivery**（须书面：token 仅公开可读 scope；仍禁止 preview token） |
| 9 | **缓存 / 失效** | 钉死：TTL 秒（默认 **60**）或「按 webhook 失效」；发布后最大可见延迟（默认 **≤ TTL**）；□ 启用 CMS webhook 失效（secret 名）□ N/A 纯 TTL |
| 10 | **用户可见面** | 钉死：公开页只展示 `published`；编辑/预览面可看 `draft`（须鉴权或 preview 凭据）；校验失败原因对编辑者可见（安全裁剪后） |
| 11 | **应用册对接** | □ nextjs □ react □ go □ fastapi □ 多册 — 本册为 Content Publish Lifecycle SSOT |

## 若适用

| # | 项 | 何时 |
|---|-----|------|
| 12 | **Webhook 签名** | §9 启用失效 webhook：算法 + 原始 body + secret；坏签不改缓存/状态 |
| 13 | **多 locale** | 消费路径须带 `locale`；缺省 locale 钉死；未翻译回退策略（□ 回退默认语 □ 404） |
| 14 | **媒体 / 富文本** | 图片 URL 变换归属（CMS CDN vs 应用 object-storage）；禁把二进制当 CMS 正文 SSOT 却无大小上限 |
| 15 | **撤回策略** | 默认允许 `published → draft`（unpublish）；公开 Delivery 立即或 ≤TTL 不可见 |
| 16 | **禁止清单确认** | 勾选：□ **不**在公开 Delivery 路径返回 draft；□ **不**用 Studio/Admin UI 手工当唯一正确性路径；□ **不**双 SSOT 两家 CMS |

## 模式裁剪（钉死）

| 勾选 | 必读章 | 可 N/A |
|------|--------|--------|
| §1=Sanity / Contentful / Payload | 03–08；`04` 对应映射节 | 其它供应商空表 |
| §1=自建 | 03–08；`04` 自填映射表至同等密度 | 三家专有字段名 |
| §8=BFF（默认） | `08` 全章 | 客户端直调安全专节可缩 |
| §8=SSG | `08` 构建拉取 + 失效 | 运行时 BFF 热路径可缩 |
| §8=客户端直调 | `08` + token scope 书面 | — |
| §9=webhook 失效 | `07`/`08` + §12 | 纯 TTL 时 webhook 节 N/A |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
