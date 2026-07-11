# Go — Language Gate

> Normative: MUST / MUST NOT（RFC 2119；DO / DO NOT 同义，本文件统一用 MUST）

## 适用范围

- 应用册：[go](../../go/README.md)（及其他默认栈为 Go 的挂靠册）
- **MUST NOT** 把 chi 路由 Lifecycle / sqlc 查询设计细则写入本闸（属应用册）

## 最高准则映射（必填）

| 准则 | 本语言如何落实（≤5 条硬门闸 ID） |
|------|----------------------------------|
| 极简 | G01, G02 |
| 清晰可测 | G03, G04, G05 |
| 算法精妙 | G06 |

## Formatter / Linter（仆人；互斥任选）

| 角色 | 工具 | 命令字符串 | 配置落点 |
|------|------|------------|----------|
| fmt | gofmt | `test -z "$(gofmt -l .)"` | 无额外配置；**MUST NOT** 并行默认 gofumpt（若改 gofumpt 须整表替换并更新挂靠 commands） |
| lint | golangci-lint | `golangci-lint run` | `.golangci.yml` |

## 硬门闸

| ID | 归属准则 | 关键词 | 规约 | 探针 |
|----|----------|--------|------|------|
| G01 | 极简 | MUST NOT | 保留未使用的包、变量、函数或「以后可能用」的文件 | `unused` / `ineffassign` via golangci-lint；无保留理由 = FAIL |
| G02 | 极简 | MUST NOT | 为抽象而抽象的 interface（实现仅一处且无多实现必要） | 评审 D2：删 interface 后仍可测则删 |
| G03 | 清晰可测 | MUST | 导出函数的 `error` **MUST** 被检查；**MUST NOT** 用 `_ = err` 吞掉请求路径错误 | `errcheck` / 等价 lint |
| G04 | 清晰可测 | MUST | 请求路径传递 `context.Context`；**MUST NOT** 在 handler 业务链使用裸 `context.Background()`（除 main 启动） | 单测或 lint；应用册 `00` 可引用本条探针 |
| G05 | 清晰可测 | MUST | 领域规则可表驱动单测；禁止假成功 | `go test` case→期望 |
| G06 | 算法精妙 | SHOULD | 热路径（序列化、鉴权中间件、批量 DB）选充分简单算法；偏离写明 | 注释/基准 + 探针 |

## 命名边界

- Pass1/Pass2 → 应用册 `02`；本文件不写大小写表

## 证据与冲突

| 来源 | 采用? | why（相对 §0） |
|------|-------|----------------|
| gofmt / Effective Go（格式段） | 是 | P0 仆人 |
| golangci-lint | 是 | 可机械检查 |
| Google Go Style | 部分 | 不整书入库；与 §0 冲突取 §0 |
| gofumpt 更严格式 | 否（默认） | 非官方默认；改则须书面并统一 commands |

## 接入检查

- [ ] 01 已链接 [ ] commands 逐字一致 [ ] 11 = 固定句
- [ ] 每条硬门闸含 MUST/MUST NOT/SHOULD/SHOULD NOT/MAY
