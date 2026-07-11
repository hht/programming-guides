# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写 GraphQL 实现**。  
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL/字段表/P0）。  
**UI**：本册为 API 品类 → 产品 UI frame **N/A**（客户端接线见应用册；本册只钉 HTTP/GraphQL 契约）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **契约形态** | □ **Schema-first SDL**（本册唯一默认；须勾）。换 code-first → **禁止作默认**；若强行 → 书面理由 + 仍须导出等价 SDL 为 CI SSOT + P0 对照 URL |
| 2 | **SDL 路径** | 仓库内 schema 根路径钉死（默认 `schema/**/*.graphql` 或单文件 `schema.graphql`）；与 [templates/schema.stub.graphql](./templates/schema.stub.graphql) 对齐演进 |
| 3 | **HTTP 端点** | staging/prod **成对** GraphQL HTTP URL（例 `/graphql`）；值可进公开配置，密钥不入库 |
| 4 | **服务运行时** | □ **GraphQL Yoga**（默认）□ Apollo Server（仅书面理由：既有仓迁移；新仓禁止默认 Apollo） |
| 5 | **鉴权对接** | □ 对齐 [docs/auth](../auth/README.md) Session Gate（Cookie 会话）□ Bearer（auth 模式 D）□ 书面混合（须列哪些 Operation 用哪扇门）。**禁止**「GraphQL 端点整体公开、Mutation 无鉴权」 |
| 6 | **写路径策略** | 所有 `Mutation`：须鉴权（§5）+ 输入校验（SDL 非空 / 自定义标量 / resolver 业务校验）。公开只读 Query allowlist 须**显式列举**；无 allowlist → 默认全部 Operation 需会话 |
| 7 | **错误码 + HTTP 运输** | 错误码至少：`UNAUTHENTICATED` / `FORBIDDEN` / `VALIDATION_FAILED` / `NOT_FOUND` / `INTERNAL` → `extensions.code`。**HTTP 默认钉死（禁止双开口）**：□ **A（默认）** GraphQL-over-HTTP：业务/鉴权失败仍 **HTTP 200** + `errors[]`（运输层仅在缺 body/非 JSON 时用 400）□ **B** 未认证 **HTTP 401** + `errors[]`（须书面；全仓统一）。缺 `query` 字段：**运输层 HTTP 400**（不进入 Lifecycle 步骤 2+） |
| 8 | **Introspection** | development：可开。staging/prod：□ **默认关** □ 受控（allowlist IP / 仅运维角色 / 独立内网端点）— 须勾一；**禁止**生产对公网匿名开 introspection |
| 9 | **客户端 Typed document** | □ **graphql-codegen** Typed document（默认）。应用册路径：operations `*.graphql` / `*.gql` + codegen 配置路径 |
| 10 | **环境成对** | staging/prod：`APP_ENV`、`GRAPHQL_PATH`（或完整 URL）、与 auth 共用的 `SESSION_SECRET`/`DATABASE_URL`（若 Gate 依赖）；**密钥值不入库** |
| 11 | **应用册对接** | □ nextjs □ react □ go □ fastapi □ 多册（列清单）— 本册为 GraphQL 契约与 Operation Lifecycle SSOT（`08`） |
| 12 | **持久化操作** | □ 不用 □ 用（须钉 allowlist 存储位置 + CI 校验「未登记 operation 拒绝」）。默认建议 staging/prod **宜用**；开发可关 |
| 13 | **订阅（Subscription）** | □ **N/A — 本切片不做** □ 要（须另钉传输：WS/SSE + 鉴权；本册核心路径仍以 HTTP Query/Mutation 为准） |

## 若适用

| # | 项 |
|---|-----|
| 14 | 自定义标量清单（DateTime、Money…）与序列化规则 |
| 15 | DataLoader / N+1 预算（字段级；无则写「首版无批量字段」） |
| 16 | CORS：浏览器跨源时 origin 白名单（与 auth `07` 一致；禁 `*`+credentials） |
| 17 | 深度/复杂度限制数字（默认见 `07`；改则写死） |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
