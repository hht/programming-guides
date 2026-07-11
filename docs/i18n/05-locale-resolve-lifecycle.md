# 05 — Locale Resolve Lifecycle（核心）

## 不变量

- 全文唯一核心路径名：**Locale Resolve Lifecycle**。  
- 顺序钉死：**detect locale → load messages → render / missing-key fail**。  
- 编号不可跳步；不可在 load 失败时用空对象「成功渲染」；不可在缺 key 时假装渲染成功（见步骤 3）。  
- 文案 SSOT 为 JSON/ICU；禁硬编码用户可见串。

## 步骤规格（实现自写）

### 1. detect locale

1. 按 [04](./04-detect-locale.md) 解析候选，产出 `resolvedLocale: AppLocale`。  
2. 失败（无默认、配置损坏）→ `i18n.locale_unsupported` / 配置错误；**停止**。  
3. 成功 → 进入步骤 2；持久化偏好策略按宿主（cookie / storage）在此或语言切换动作中写入。

### 2. load messages

1. 按 [06](./06-load-messages.md) 加载 `resolvedLocale` 的消息目录（同步 import 或 async；RSC 在服务端按请求加载）。  
2. 校验：JSON 可解析；可选 ICU 预编译。  
3. 失败 → `i18n.messages_load_failed`；**停止**；UI = error / 重试，**禁止**用另一 locale 目录静默顶替除非 INPUTS 书面「仅缺文件时 fallback 默认 locale」且 **仍打日志**（默认：**不**跨 locale 静默顶替）。  
4. 成功 → 得到 `messages`；进入步骤 3。

### 3. render / missing-key fail

1. 组件通过 `t(key)` / `useTranslations` / `<FormattedMessage>` 取值（[07](./07-render-and-format.md)）。  
2. **key 存在**：ICU 求值 → 用户可见字符串（或富文本节点，若库支持且 INPUTS 允许）。  
3. **key 缺失** → **fail**（[08](./08-missing-key-and-hardcode-gate.md)）：  
   - **dev**：抛错或 error overlay（不得仅 console.warn 后显示 key 名当正文）。  
   - **CI**：`check-messages` / 类型检查红灯。  
   - **prod（默认 fail-loud）**：记录 `i18n.missing_key`（含 key、locale）；渲染 **错误哨兵**（空、通用「内容不可用」**且该哨兵本身来自已存在的 fallback key** 如 `i18n.contentUnavailable`，或边界 Error UI）——**禁止**把缺失的 key 字符串（如 `swap.title`）显示给用户当文案；**禁止**无日志成功返回。  
4. ICU 运行时求值错误（参数缺失等）→ 同缺 key 等级：**fail**（dev 抛；prod 记录 + 哨兵）。

### 伪代码（规格级）

```text
function resolveLocaleAndRender(request | bootstrap):
  locale = detectLocale(request)                 # 1
  if locale.invalid: return fail(locale_unsupported)

  messages = loadMessages(locale)                # 2
  if messages.failed: return fail(messages_load_failed)

  return provide(locale, messages, onError=missingKeyFail)  # 3

function t(key, values):
  msg = messages[key]
  if msg is missing:
    missingKeyFail(key, locale)                  # 3 fail
    return contentUnavailableSentinel            # prod；dev throws before return
  return formatICU(msg, values, locale)
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 检测回退到默认 | 允许；可打 `locale_fallback` |
| load 失败 | 不进入业务 render；error UI |
| 缺 key | **fail**（上表步骤 3） |
| 硬编码串 | 门禁红灯（`08`）；不属本生命周期成功态 |
| 跳过 detect 写死 `en` | **禁止**当多语产品唯一策略（单语产品：支持列表仅默认，仍走 detect→load→render） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 快乐路径 | detect→load→t(knownKey) 正确文案 |
| 不支持 locale | 默认 locale 或重定向；可观测 |
| 消息文件 404 | messages_load_failed；无假成功 |
| 缺 key（dev） | 抛错 / 测试红 |
| 缺 key（prod 策略） | 有错误记录；不展示 raw key |
| 跳过 load 直接 t | 架构/单测 FAIL |
