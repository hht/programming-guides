# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写 i18n 运行时 / 消息目录 / locale 路由**。  
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL / locale 码 / P0）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **应用宿主（互斥钉死恰好一行）** | □ **Next.js App Router**（默认运行时 **`next-intl`**）□ **Vite SPA**（默认运行时 **`react-intl`**）□ **其它**（书面：库名 + 仍映射 Locale Resolve Lifecycle）— **禁止**「next-intl 或 i18next 任选」双开口 |
| 2 | **locale 列表** | BCP 47 标签 ≥1；标明 **默认 locale**（例 `en`）；支持列表与默认写入代码常量/配置 SSOT 一处 |
| 3 | **文案目录路径** | 例 `messages/{locale}.json` 或 `messages/{locale}/**/*.json`；格式钉死 **JSON + ICU MessageFormat**；禁平行 YAML/TS 第二套生产源 |
| 4 | **检测序（主路径）** | 确认采用本册 `04` 默认序，或书面差分表（旧步→本册步）；须覆盖：显式用户选择、URL（若 Next）、持久化偏好、`Accept-Language`、默认 locale |
| 5 | **缺 key 策略** | 确认 **fail**（见 `08`）：dev **抛错**；CI **红灯**；prod □ **fail-loud**（默认：记录错误 + 不渲染 key 字符串当正文）□ 书面降级（须仍打日志/指标，禁静默成功） |
| 6 | **硬编码门禁** | 勾选：用户可见串 **必须**经消息 key；例外白名单（商标字符、纯标点、设计 token 色名）书面 ≤N 条 |
| 7 | **错误码 / 文案 key 对照** | 业务错误码 → 消息 key 至少覆盖应用册 ERROR 表；无裸英文错误塞 UI |
| 8 | **数字 / 日期时区** | 默认用 `Intl` + 当前 locale；默认时区策略：□ 用户偏好 □ 固定 `UTC` □ 固定 IANA 名（钉死） |
| 9 | **环境成对** | staging/prod：同一 locale 列表与默认；`APP_ENV`；若 URL 前缀策略不同须成对写明 |
| 10 | **应用册对接** | □ react □ nextjs □ 多册 — 本册为 **Locale Resolve Lifecycle** 与文案 SSOT |

## 若适用

| # | 项 | 何时 |
|---|-----|------|
| 11 | **Next locale 路由** | 宿主=Next：□ `/{locale}/…` 前缀（**默认**）□ 域名分 locale — 互斥钉一种 |
| 12 | **消息分片** | 目录 > **INPUTS 钉的阈值**（默认建议 200 keys 或 50 KiB/文件）时：按 route/feature namespace 分片；加载策略见 `06` |
| 13 | **伪 locale / RTL** | □ 不做（默认）□ 做：伪 locale 名（例 `en-XA`）与/或 `dir=rtl` 探针 |
| 14 | **服务端渲染** | Next RSC：消息在服务端按请求 locale 注入；禁客户端后再「猜」另一 locale 作为首屏 SSOT |
| 15 | **运行时改选** | 不用 `01` 默认库：书面理由 + 单一替代名（仍 ICU JSON）；**禁止**双运行时 SSOT |
| 16 | **翻译外包 / TMS** | □ 不做（默认）□ 做：导入导出格式仍落回本册 JSON ICU；TMS 非 SSOT |
| 17 | **禁止清单确认** | 勾选：□ 不硬编码用户可见串 □ 不静默吞缺 key □ 不以 i18next 作未声明默认 □ PC/H5 不另造同义 key |

## 宿主裁剪（钉死）

| 宿主 | 必读章 | 运行时 |
|------|--------|--------|
| Next.js App Router | 03–08；`04` URL 段；`06` RSC | `next-intl` |
| Vite SPA（react） | 03–08；`04` 无强制 URL 段时可 cookie/query | `react-intl` |
| 其它（INPUTS §1） | 03–08 全映射 | 书面单库 |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
