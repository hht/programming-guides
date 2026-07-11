# Rust — Language Gate

> Normative: MUST / MUST NOT（RFC 2119；DO / DO NOT 同义，本文件统一用 MUST）

## 适用范围

- 应用册：[rust-api](../../rust-api/README.md)（及其他默认栈为 Rust 的挂靠册）
- **MUST NOT** 把 Axum 路由 / sqlx 查询 Lifecycle 写入本闸（属应用册）

## 最高准则映射（必填）

| 准则 | 本语言如何落实（≤5 条硬门闸 ID） |
|------|----------------------------------|
| 极简 | G01, G02 |
| 清晰可测 | G03, G04, G05 |
| 算法精妙 | G06 |

## Formatter / Linter（仆人；互斥任选）

| 角色 | 工具 | 命令字符串 | 配置落点 |
|------|------|------------|----------|
| fmt | rustfmt | `cargo fmt --check` | `rustfmt.toml`（可空） |
| lint | clippy | `cargo clippy -- -D warnings` | `Cargo.toml` / clippy 配置 |

挂靠册可将二者合并为一条 `lint`（rust-api 现状），子命令须与上表逐字一致。

## 硬门闸

| ID | 归属准则 | 关键词 | 规约 | 探针 |
|----|----------|--------|------|------|
| G01 | 极简 | MUST NOT | 保留 dead_code / unused 无理由 | clippy / `deny(dead_code)` 等价；例外须写明 |
| G02 | 极简 | MUST NOT | 无多实现必要的额外 trait 对象层（D2） | 评审删层 |
| G03 | 清晰可测 | MUST | 可失败操作使用 `Result`；**MUST NOT** 在请求路径默认 `unwrap`/`expect` 无文档化不变式 | clippy `unwrap_used` 或单测约定；生产路径禁裸 unwrap |
| G04 | 清晰可测 | MUST | 错误类型可映射稳定 API code；禁止把内部 Display 直接回客户端 | 应用册错误章 + 单测 |
| G05 | 清晰可测 | MUST | 领域逻辑可 `cargo test`；禁止假成功 | case→期望 |
| G06 | 算法精妙 | SHOULD | 热路径选充分简单算法；偏离写明 | 注释/基准 + 探针 |

## 命名边界

- Pass1/Pass2 → 应用册 `02`；本文件不写大小写表

## 证据与冲突

| 来源 | 采用? | why（相对 §0） |
|------|-------|----------------|
| rustfmt / clippy 官方 | 是 | P0 |
| Rust API Guidelines | 部分 | 可映射学习；不整书入库 |
| Google 无官方 Rust Style 全书 | N/A | — |

## 接入检查

- [ ] 01 已链接 [ ] commands 逐字一致 [ ] 11 = 固定句
- [ ] 每条硬门闸含 MUST/MUST NOT/SHOULD/SHOULD NOT/MAY
