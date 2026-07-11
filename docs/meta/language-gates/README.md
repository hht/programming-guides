# Language Gates

> SSOT 契约：[language-engineering-contract.md](../language-engineering-contract.md)。  
> 状态枚举：`DRAFT` → `FOCUSED`（Focused B+E PASS，可挂靠）→ `PASS`（主挂靠应用册 Full 5/5 且 commands 逐字一致）。

| 语言 | 文件 | 状态 | 主挂靠 | 次挂靠（已接线） |
|------|------|------|--------|------------------|
| TypeScript | [typescript.md](./typescript.md) | **PASS** | [react](../../react/README.md)、[nextjs](../../nextjs/README.md) | expo · node-cli · graphql · serverless · defi · desktop-tauri（TS 侧）· agent（TS 栈） |
| Go | [go.md](./go.md) | **PASS** | [go](../../go/README.md) | — |
| Python | [python.md](./python.md) | **PASS** | [fastapi](../../fastapi/README.md) | agent（Python 栈） |
| Rust | [rust.md](./rust.md) | **PASS** | [rust-api](../../rust-api/README.md) | desktop-tauri（Rust 侧） |
| Kotlin | [kotlin.md](./kotlin.md) | **PASS** | [kotlin-backend](../../kotlin-backend/README.md) | android-compose |
| Swift | [swift.md](./swift.md) | **PASS** | [apple-platforms](../../apple-platforms/README.md) | — |

Focused B+E：2026-07-11 **6/6 PASS**。  
主挂靠 Full 5/5（gate 挂靠 + commands 逐字 + 框架 MUST 重审）：2026-07-11 **6/6 PASS** → 上表均为 `PASS`。  
开闸序：typescript → go → python → rust → kotlin → swift（已完成）。  
禁止平行「仅语言规范」百科册；框架 MUST 只在应用册 `00`（含横切能力册；语言层跟宿主，不另开闸）。
