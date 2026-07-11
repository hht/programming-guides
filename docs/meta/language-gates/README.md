# Language Gates

> SSOT 契约：[language-engineering-contract.md](../language-engineering-contract.md)。  
> 状态枚举：`DRAFT` → `FOCUSED`（Focused B+E PASS，可挂靠）→ `PASS`（主挂靠应用册 Full 5/5 且 commands 逐字一致）。

| 语言 | 文件 | 状态 | 主挂靠册 | 备注 |
|------|------|------|----------|------|
| TypeScript | [typescript.md](./typescript.md) | FOCUSED | [react](../../react/README.md)、[nextjs](../../nextjs/README.md) | React hooks **不**进本闸；挂靠已完成，Full 5/5 后升 PASS |
| Go | [go.md](./go.md) | FOCUSED | [go](../../go/README.md) | 同上 |
| Python | [python.md](./python.md) | FOCUSED | [fastapi](../../fastapi/README.md) | FastAPI DI **不**进本闸 |
| Rust | [rust.md](./rust.md) | FOCUSED | [rust-api](../../rust-api/README.md) | 同上 |
| Kotlin | [kotlin.md](./kotlin.md) | FOCUSED | [kotlin-backend](../../kotlin-backend/README.md) | Compose UI 不进本闸 |
| Swift | [swift.md](./swift.md) | FOCUSED | [apple-platforms](../../apple-platforms/README.md) | SwiftUI Lifecycle 不进本闸 |

Focused B+E：2026-07-11 **6/6 PASS**（model: grok-4.5-fast-xhigh）。  
开闸序：typescript → go → python → rust → kotlin → swift。  
禁止平行「仅语言规范」百科册；框架 MUST 只在应用册。
