# 08 — 质量

## 必做

- `cargo fmt --check`  
- `cargo clippy -- -D warnings`  
- `cargo test`  
- 生产：tracing JSON；`APP_ENV=prod` 时禁默认 `debug`/`trace` 刷屏  

## 宜做 / 参考

| 项 | 要求 |
|----|------|
| Miri / sanitizer | 宜做；本指南默认裁剪：理由=HTTP API 发版以 `test-integration` 矩阵为准，不进必勾 |
| OTel/Sentry | **仅参考**，不进必勾 |
| `tokio-console` / 火焰图 | 仅非 prod 或受控 |

## 单测探针

| case | 期望 |
|------|------|
| clippy + fmt | CI exit 0 |
