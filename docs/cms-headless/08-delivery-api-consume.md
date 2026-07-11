# 08 — Content Delivery API 消费

## 不变量

- **公开消费只走 Delivery**（`fetchPublished` + Delivery token）。 
- **Preview 与 Delivery 凭据分离**；preview token **永不**进公开前端 bundle。 
- 响应经 **投影** 为 `ContentDocument`；页面/API **不**依赖供应商字段名。 
- 缓存行为服从 INPUTS §9；撤回后可见窗口有上限。

## 步骤规格（实现自写）

### 按 INPUTS §8 三选一

| 形态 | 规格 |
|------|------|
| **BFF（默认）** | 服务端 loader/handler 调 `fetchPublished` → 投影 → 渲染/JSON；浏览器不持有 CMS token |
| **SSG** | 构建时 `fetchPublished`；发布/撤回后重建或 on-demand revalidate；延迟 ≤ 契约 |
| **客户端直调** | 仅 Delivery **公开可读** token；仍禁 preview；CORS/scope 须写明；错误映射同 BFF |

### 查询与错误

1. 查询键：`content_type` + `slug|id` + `locale?`。 
2. **仅 published**：适配器内过滤供应商状态（Contentful CDA、Strapi 默认/`status=published`、Payload `_status=published`）；返回 draft 正文 = **实现缺陷**。 
3. 未发布 / 不存在 → 对外 404（对内可分码）。 
4. CMS 5xx → `CMS_UNAVAILABLE`；可回落 stale-if-error（INPUTS 约定：默认 **允许 stale ≤ TTL** 或 **硬失败** 二选一）。 
5. 列表/分页：若产品需要，单独约定 page size 默认 **20**、上限 **100**。

### 缓存键

```text
cms:delivery:{content_type}:{slug}:{locale}
```

失效：publish/unpublish/webhook → delete 该键；禁「清全站」作唯一策略除非类型极少且写明。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| NotFound | 404 |
| Unauthorized Delivery | `DELIVERY_UNAUTHORIZED`；修配置，不静默空页当成功 |
| 超时 | 按 stale-if-error 策略；默认超时 **5s**（INPUTS 可改） |
| 误用 preview token 于公开路径 | 配置/启动失败或集成测试红灯 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| published slug | 200 + 投影字段 |
| 仅 draft | 404 |
| preview 路径可见 draft | 200（鉴权下） |
| 缓存键在 unpublish 后 | miss → 404 |
| 适配器外页面 import CMS SDK | lint/架构测试红灯（推荐） |
