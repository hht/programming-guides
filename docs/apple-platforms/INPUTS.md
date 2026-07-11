# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写原生实现**。 
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL / frame 名 / API 字段表 / P0）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **目标平台（可多选，至少一）** | □ iPhone □ iPad □ Mac（Catalyst **禁止**作默认；Mac = **原生 AppKit/SwiftUI Mac target**）。勾选决定 `08` 是否必读 |
| 2 | **最低部署版本** | 写明 iOS / iPadOS / macOS 最低版本（须支持 SwiftUI `NavigationStack` + Observation；建议 iOS 17+ / macOS 14+；更低须写明桥接成本） |
| 3 | **设计稿 + UI 状态** | Figma/等价 frame：**至少**覆盖 `default` / `loading` / `empty` / `error` / `submitting`（或产品等价名）；填 [templates/view-state-matrix.md](./templates/view-state-matrix.md)；**禁止**标整表 N/A |
| 4 | **主用户任务** | 一句话：用户完成什么（例：浏览时间线并发布帖子；管理虚拟机） |
| 5 | **API / 本地数据契约** | □ 远程 API：OpenAPI/字段表 + 错误码 □ 纯本地：模型字段表 + 持久化边界（UserDefaults/SwiftData/文件）须写明；二者可并存 |
| 6 | **鉴权（若适用）** | □ 无 □ 有 — 对接 [docs/auth](../auth/README.md) 或写明等价；token 落点禁 Keychain 以外明文 |
| 7 | **环境成对** | staging/prod：`API_BASE_URL`（或等价）、可选 `APP_ENV`；用 xcconfig / `.xcconfig` 成对；**密钥不入库**（见 [templates/xcconfig.example](./templates/xcconfig.example)） |
| 8 | **Bundle ID / 签名** | 开发 Team、Bundle ID 模式（staging/prod 后缀策略须写明）；CI 用何证书策略一句 |
| 9 | **错误码 → UI** | 至少：`NETWORK` / `UNAUTHORIZED` / `NOT_FOUND` / `VALIDATION` / `CANCELLED` / `UNKNOWN` → 用户可见态（toast / inline / full-screen） |
| 10 | **导航根** | 根形态：□ 单 `NavigationStack` □ `Tab` + 每 Tab 一栈 □ 其它（须图 + 理由）。深链 URL scheme / Universal Link：**有则列路由表；无则写 `N/A — no deep link`** |
| 10b | **同 Route 重复 push** | 互斥任选一种：□ **允许**栈内重复同 Route □ **去重**（已在栈则 pop 到该 Route 或忽略二次 push——择一写明谓词）。默认未勾 → **允许** |
| 11 | **Mac 面（§1 含 Mac 时必填）** | 主窗口策略（单窗 / 多窗）；菜单栏命令表（至少 Quit / 偏好 / 主操作）；键盘快捷键表。§1 无 Mac → 本行 `N/A` |
| 12 | **无障碍与动态字体** | □ 遵守 HIG：VoiceOver 标签计划 + Dynamic Type；裁剪须写明一行理由 |
| 13 | **测试设备矩阵** | 发版至少：1× iPhone 模拟器 +（若 iPad）1× iPad +（若 Mac）1× macOS；列 Xcode scheme 名 |

## 若适用

| # | 项 |
|---|-----|
| 14 | 推送 / Background Modes（能力列表 + 隐私文案） |
| 15 | Widget / App Intent / Share Extension（独立 target 名） |
| 16 | 内购 / StoreKit（产品 ID 表） |
| 17 | SwiftData 模型版本策略 |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
