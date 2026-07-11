# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
messages/ # 文案 SSOT（仓库根或 src/ 旁；INPUTS 约定路径）
 en.json # 默认 locale 扁平或嵌套对象；值为 ICU 字符串
 zh-CN.json
 # 或分片：
 # en/common.json
 # en/swap.json

src/
 i18n/ # 基础设施：检测、加载、provider；非业务域名
 locales.ts # 支持列表 + defaultLocale（SSOT 常量）
 detect-locale.* # 步骤 1
 load-messages.* # 步骤 2
 missing-key.* # onError / fail 策略
 features/
 <capability>/ # 业务能力目录；组件只引用 message key
 <screen>.* # 禁内联用户可见英文/中文句子
```

依赖方向：`detect → load → render`；`features/*` 依赖 `i18n` 的 t/`useTranslations`/`FormattedMessage`，**禁止** `i18n` 依赖具体 feature。 
消息文件 **不**放进 `features/` 作为第二 SSOT（分片文件仍归 `messages/` 树）。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。 
2. **消息 key 按用户任务 / 界面区域**，不是按组件文件名技术词：正例 `swap.submit`、`auth.login.title`；反例 `Button1Text`、`handleClickLabel`、`CompXxxTitle`。 
3. 一词一义：`Locale`（已解析的 BCP 47）≠ `Messages`（该 locale 的目录）≠ `MessageKey`（目录内键）。 
4. 禁 `I18nManager`、`LocaleService`、`TranslationHelper`、`*Dto` 作领域主名；基础设施文件可用中性名 `detect-locale`、`load-messages`。

| 概念 | 正例 | 反例 |
|------|------|------|
| 目录根 | `messages/` | `src/strings-backup/` 平行源 |
| key | `order.checkout.pay` | `payBtn` / `text1` / `lorem` |
| 检测 | `detectLocale` | `handleLang` / `getLangStuff` |
| 加载 | `loadMessages` | `fetchI18n` / `processJson` |
| 缺 key | `missingKeyFail` / `onMissingMessage` | `ignoreMissing` 当默认 |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| locale 标签 | BCP 47（`en`、`zh-CN`）；文件名与标签一致 |
| message key | **dot 路径** `segment.segment`；segment = `camelCase` 或 INPUTS 约定的 `snake_case`（互斥一种） |
| TS 导出 | `camelCase` 函数；类型 `PascalCase`（`Messages`、`AppLocale`） |
| cookie / storage 键 | INPUTS 约定唯一名称（例 `NEXT_LOCALE` / `app_locale`） |
| 环境变量 | `APP_DEFAULT_LOCALE` 等 `SCREAMING_SNAKE` |
| 错误 | `i18n.missing_key` / `i18n.locale_unsupported` / `i18n.messages_load_failed` |

## UI 状态（locale 切换若有）

至少：`idle | detecting | loading-messages | ready | error`；矩阵见 `templates/locale-resolve-state-matrix.md`。 
切换 locale 时：允许短暂 `loading-messages`；**禁止**在 messages 未就绪时用上一 locale 文案冒充新 locale 成功（可显示骨架，不可谎报已切换完成）。
