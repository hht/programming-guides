# 09 — 测试与 CI

## 探针（case → 期望）

| case | 命令 | 期望 |
|------|------|------|
| INPUTS 谓词 | `check-inputs` | exit 0 |
| locale 列表含默认 | `check-inputs` | exit 0 |
| 全 locale key 全等 | `check-messages` | exit 0 |
| 故意缺 key | `check-messages` | ≠ 0 |
| 非法 ICU | `check-messages` | ≠ 0 |
| detect URL/cookie/Accept-Language | `test` | 与 `04` 序一致 |
| load 成功后 t(known) | `test` | 文案匹配目录 |
| 缺 key dev | `test` | throw / fail |
| 缺 key 不展示 raw key | `test` | 哨兵或错误 UI |
| 硬编码用户可见串 | `check-hardcoded` | ≠ 0 当引入时 |
| Lifecycle 跳步 | 架构/`test` | FAIL |

## 发版矩阵（场景 × 断言）

| # | 场景 | 断言 |
|---|------|------|
| 1 | 默认 locale 首屏 | detect→load→关键文案来自 JSON |
| 2 | 切换到第二 locale | 文案更新；ready 前不谎报完成 |
| 3 | 不支持 locale（URL） | 重定向或默认；不崩溃 |
| 4 | 复数 / 插值句 | ICU 规则正确 |
| 5 | 业务错误码 | 显示对应消息 key，非 raw 英文堆栈 |
| 6 | 缺 key 构建产物 | CI 已红；或运行时 fail-loud |
| 7 | features 无新增硬编码句 | `check-hardcoded` 绿 |
| 8 | `check` | exit 0 |

PR：`check`。发版：同 + staging 抽检默认与第二 locale 各 1 条主路径文案。
