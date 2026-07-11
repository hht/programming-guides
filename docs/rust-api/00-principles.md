# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层 → [rust Language Gate](../meta/language-gates/rust.md)。本文件只含 **Rust API 品类 MUST**。

## 决策优先级

正确性 > 可验证性 > 简洁性 > 复用 > 速度。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | axum handler 只做解码/编码/status；业务在 `src/<bc>/` | 单测 |
| F02 | MUST | 下游 DB / 出站 HTTP 接 cancellation / 请求生命周期 | 代码抽检 |
| F03 | MUST NOT | 在请求路径 `block_in_place` / 裸 `std::thread::sleep` | 同上 |
| F04 | MUST | 领域错误 → 稳定 `code` + HTTP status；未知 → `INTERNAL` + 日志 | `09` |
| F05 | MUST NOT | 把内部 `Display`/`Debug` 字符串直接回客户端 | 同上 |
| F06 | MUST | SQL 只经 sqlx（`query!` / `query_as!` / migrate SQL） | handler 无业务 SQL 字符串 |
| F07 | MUST | 跨多表或多语句写必须显式 `BEGIN` | 单测 |
| F08 | MUST | 缺必填 env → `main` 非 0 退出 | 启动探针 |
| F09 | MUST | deletion-first；无 INPUTS 的端点不做 | INPUTS |

## SSOT

| 真相 | Owner |
|------|--------|
| 路由 | `src/server/routes.rs`（或等价单处） |
| OpenAPI / 端点契约 | INPUTS → 仓内 **`openapi.yaml`**（唯一） |
| SQL schema | `migrations/` |
| 查询 | sqlx 宏 / 查询函数（禁 handler 内联字符串 SQL） |
| 配置 | `src/config.rs`（或 `src/config/`） |
| 错误码 | `src/api_errors.rs`（或 `src/api_errors/`） |
| 日志 | `tracing`（生产 JSON subscriber） |

## 超越对照

1. `对照：B 中更弱/未见「请求路径强制 request_id 写入 tracing 与响应头」硬门闸 → 本指南要求`  
2. `对照：B 中更弱/未见「多表写必须显式事务否则禁止合并提交」硬门闸 → 本指南要求`
