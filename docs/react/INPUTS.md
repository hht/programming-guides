# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写业务页**。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **身份** | 包名、产品名、公开 origin（staging/prod） |
| 2 | **设计稿** | 页面 frame 列表；PC 文案 SSOT；填 [templates/page-state-matrix.md](./templates/page-state-matrix.md) |
| 3 | **路由表** | path、需否登录、布局（app/auth/marketing）、深链参数 |
| 4 | **API 契约** | OpenAPI 3.x 或等价表（端点 method+path+请求/响应字段即可）；**业务错误码 → `AppError.code`（见本文件 #10）→ 文案 key** 三列对照；staging/prod Base URL 成对 |
| 5 | **鉴权策略** | 勾选其一：□ 无登录 □ Cookie session（`credentials:include`；SameSite；若需 CSRF 写头字段名） □ Bearer **仅 memory** □ OAuth（提供商+回调 path+换会话后落点再勾 Cookie 或 Bearer）。**凡非「无登录」**：须写明会话探测端点（例 `GET /me`）与 401 语义 |
| 6 | **主 Mutation** | 用户可感知的一条主提交流（创建/更新/删除名 + 成功后跳转或停留） |
| 7 | **表单字段表** | 主 mutation 的字段：名/类型/必填/默认/校验规则（可指向 Zod 草图） |
| 8 | **环境变量名** | 至少 `VITE_APP_ENV`、`VITE_API_BASE_URL`；前缀统一 |
| 9 | **i18n** | □ 单语（默认 en 或产品语） □ 多语（列 locale） |
| 10 | **ERROR CODE 表** | 至少：`NETWORK`、`UNAUTHORIZED`、`VALIDATION`、`CONFLICT`、`UNKNOWN`（各含文案 key） |

## 若适用

| # | 项 |
|---|-----|
| 11 | 文件上传：大小/MIME/直传或经 API |
| 12 | 实时：SSE/WebSocket 事件表 |
| 13 | 功能开关 env 名 |

## 门闸

```text
INPUTS OK
```

或 `INPUTS BLOCKED:` + 列表。
