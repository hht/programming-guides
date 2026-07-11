# 04 — Detect Locale

## 不变量

- 检测产出 **一个** `AppLocale`（∈ 支持列表）或明确失败/回退到 **默认 locale**（回退须可观测，见下表）。  
- 顺序钉死（可 INPUTS 书面差分，但须仍覆盖各来源）；**不可**「每次渲染随机猜」。  
- 不在支持列表内的标签 → 映射到默认（或最大前缀匹配，INPUTS 钉死；**默认 = 不匹配则 defaultLocale**）。

## 默认检测序（实现自写）

### Next.js App Router（默认）

1. **URL locale 段**（`/{locale}/…`，INPUTS §11 默认）：合法且在列表内 → 采用。  
2. **持久化偏好**（cookie 名 INPUTS 钉，例 `NEXT_LOCALE`）：合法 → 采用，并可写入 URL 重定向策略（与 `next-intl` 一致，避免环）。  
3. **`Accept-Language`**：按 q 值选 **支持列表内** 最佳；无匹配 → 下一步。  
4. **默认 locale**（INPUTS §2）。

### Vite SPA（默认）

1. **显式用户选择**（设置页 / 语言切换写入的 storage 或 cookie；键名 INPUTS 钉）。  
2. **URL query 或 path**（若产品做了；未做则跳过——须在 INPUTS 写「无 URL locale」）。  
3. **`Accept-Language`**（首屏可只读一次）。  
4. **默认 locale**。

## 步骤规格

1. 读取候选字符串（按序）。  
2. **规范化**：`zh-cn` → `zh-CN` 等与文件名一致的大小写规则（钉：跟 INPUTS 列表字面量匹配，大小写不敏感匹配后输出列表中的 canonical 标签）。  
3. 若 ∈ 支持列表 → `resolvedLocale`。  
4. 否则试前缀（仅当 INPUTS 开启；默认 **关闭**）或 → `defaultLocale`，并计 `i18n.locale_fallback` 可观测事件（日志字段即可，非商业 APM 必装）。  
5. 将结果交给步骤 load（`06`）；切换语言时重复 1–4 并触发重新 load。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 支持列表为空 | INPUTS 非法；`check-inputs` 失败 |
| URL locale 不支持 | 重定向到默认或 404（INPUTS 钉；**默认重定向默认 locale**） |
| 无 cookie / 无 Accept-Language | 用默认 locale（合法成功） |
| 用户切换到支持列表外 | UI 不得提供；API 拒绝 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| URL=`/en/...` | resolved=`en` |
| URL 非法 + cookie=`zh-CN` | 按序：URL 失败后 cookie（Next）或 INPUTS 差分 |
| 仅 Accept-Language=`fr` 且未支持 | `defaultLocale` |
| 空列表 | check-inputs 失败 |
| 切换 en→zh-CN | 新 resolved；随后 load 新目录 |
