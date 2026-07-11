# commands

| 脚本 | 命令 | 何时 | 期望 |
|------|------|------|------|
| `check-inputs` | 校验 [INPUTS.md](./INPUTS.md) 必填谓词（含 OS / command 表 / capability 表 / allowlist） | 本地/PR | exit 0 |
| `fmt-rs` | `cargo fmt --check` | PR | exit 0 |
| `lint-rs` | `cargo clippy -- -D warnings` | PR | exit 0 |
| `fmt-ts` | `pnpm exec prettier --check .` | PR | exit 0 |
| `lint-ts` | `pnpm exec eslint .` | PR | exit 0 |
| `typecheck-ts` | `pnpm exec tsc -b --pretty false` | PR | exit 0 |
| `test` | 对照 `09` 单测适用行（含 Lifecycle、allowlist、capability 拒绝） | PR | exit 0 |
| `test:e2e-desktop` | `09` 发版矩阵适用 OS 行 | 发版 | exit 0 |
| `check-acceptance` | 自检 [11](./11-world-class-acceptance.md) **A+B+D**（跳过 C） | PR | exit 0 |
| `check` | check-inputs + fmt-rs + lint-rs + fmt-ts + lint-ts + typecheck-ts + test + check-acceptance；发版加 test:e2e-desktop | PR/发版 | exit 0 |

Rust / TS 命令字符串分别与 [rust](../meta/language-gates/rust.md) / [typescript](../meta/language-gates/typescript.md) Language Gate **逐字一致**。  
建议前端 scripts 键名见 [templates/package-scripts.snippet.json](./templates/package-scripts.snippet.json)。
