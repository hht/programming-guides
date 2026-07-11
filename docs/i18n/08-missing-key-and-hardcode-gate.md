# 08 — Missing-Key Fail and Hardcode Gate

## 不变量

- **missing-key fail** 是 Locale Resolve Lifecycle 步骤 3 的失败分支，不是可选优化。  
- **禁硬编码用户可见串**：门禁与 code review 同级；白名单极窄（INPUTS §6）。  
- CI 必须在合并前抓住：跨 locale 缺 key、非法 ICU、（宜）硬编码串。

## 步骤规格（实现自写）

### A. Missing key

1. 注册运行时 `onError` / `getMessageFallback`：**不得**实现为「返回 id 本身且不记录」。  
2. **development**：抛 `i18n.missing_key`（或等价），测试与 Story 红灯。  
3. **test/CI**：  
   - 静态：所有 locale 的 key 集合 **相等**（默认）或 ⊆ 默认 + 报告缺失（若 INPUTS 改选 ⊆，仍须对默认 locale 全覆盖调用点——更易漏，故默认全等）。  
   - 可选：从源码提取所用 key ⊆ 目录。  
4. **production（默认 fail-loud）**：  
   - 记录错误（结构化日志字段：`key`、`locale`、`route`）。  
   - UI：已存在的 `i18n.contentUnavailable` 或 Error boundary；**不**展示 `swap.title` 这类 key 路径。  
5. 书面降级（INPUTS §5）：允许 fallback 默认 locale **同一 key** 仅当：打日志 + 指标；仍禁止展示 raw key；CI 仍红灯（降级不减免 CI）。

### B. Hardcode gate

1. 定义「用户可见串」：JSX 文本节点、`aria-label`、`placeholder`、`title`、Toast、空态——**须**来自消息 API。  
2. 允许例外（须 INPUTS 枚举）：品牌名注册商标字符、单个符号（`·`/`/`）、测试 id、设计 token 名（非给用户读）。  
3. 门禁实现（钉一种为主）：ESLint 插件（例 `formatjs` / 自定义 no-literal）或 `rg` 架构测试扫描 `features/**/*.tsx` 拉丁/CJK 句子；**PR `check` 调用**。  
4. shadcn/ui 等第三方英文示例：接入时 **替换** 为 key；禁止长期留示例英文在用户路径。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 缺 key | fail（上表 A） |
| 硬编码 | `check-hardcoded` ≠ 0 |
| 白名单误伤 | 写入 INPUTS 例外表；禁全局关门禁 |
| 仅 console.warn | **不满足**本指南 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 目录缺 `swap.title` 于 `zh-CN` | check-messages ≠ 0 |
| `t('not.exists')` dev | throw |
| `t('not.exists')` prod | 日志 + 哨兵；≠ raw key |
| `<button>Submit</button>` 在 features | check-hardcoded ≠ 0 |
| `<button>{t('form.submit')}</button>` | 通过 |
