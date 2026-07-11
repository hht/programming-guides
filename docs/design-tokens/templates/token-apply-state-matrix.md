# token-apply-state-matrix.md

> Token Apply Lifecycle 步骤 × 结果。复制到实现仓可作审查表。

| step | ok | blocked | notes |
|------|----|---------|-------|
| 1 source tokens | DTCG 可解析；色名 ⊆ SSOT；alias 无环 | 非 DTCG / 断链 / 第二套色名入库 | 启用 ui-ux 时路径同名 |
| 2 transform | `tokens:build` exit 0；产物路径固定 | SD 失败 / 双配置 / 手写第二产物 | drift 可比对 |
| 3 consume in UI | 仅语义名；无裸品牌 hex | 禁色名 / 临时 hex / 跳过 rebuild | dark 不改名 |

| failure mode | expected |
|--------------|----------|
| 手改 tokens.css | `tokens:check-drift` 红 |
| 新增 `ink-muted` | lint 红 |
| Figma 改名未改源 | drift 红（§7 启用） |
| alias 环 | build 红 |
