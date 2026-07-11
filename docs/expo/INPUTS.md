# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写 Expo 实现**。 
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL/字段表/P0）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **妥协层选型** | □ 书面确认：本仓用 Expo 作跨端妥协；主路径原生（apple / android-compose）不适用本仓的理由一行。未勾 → **停** |
| 2 | **应用标识** | `bundleIdentifier`（iOS）+ `applicationId` / package（Android）+ 展示名；`slug` / Expo 项目名 |
| 3 | **设计稿** | frame/screen 清单：至少 1 个主任务流；每屏含 **loading / empty / error / success**（或标明 N/A 谓词） |
| 4 | **UI 状态矩阵** | 填齐 [templates/ui-state-matrix.md](./templates/ui-state-matrix.md)（每 route × 态）；缺行 → BLOCKED |
| 5 | **API / 契约** | base URL staging/prod 成对；错误码表至少：`NETWORK` / `UNAUTHORIZED` / `NOT_FOUND` / `VALIDATION` / `UNKNOWN` → 用户可见行为 |
| 6 | **鉴权（若有）** | □ 无 □ 对接 [docs/auth](../auth/README.md) 模式（写模式字母）□ 其它（须写明 token 存放：默认 **SecureStore**；**禁** AsyncStorage 明文存 session） |
| 7 | **路由图** | Expo Router 起始 route + 主图（文件路径 ↔ 业务名）；深链若有则列 scheme + path 模式 |
| 8 | **UiState 边界** | 每屏（或共享）**一个** `XxxUiState` 类型名（词表）；禁第二套平行 state 源（含散落 `useState` 业务真相） |
| 9 | **失焦取消策略** | 每屏勾选：□ focus 加载须 AbortController/代次取消 □ 无 inflight（静态屏，标明 N/A）— 与 `07` 对齐 |
| 10 | **原生模块表** | 凡非 Expo SDK 自带模块：包名 + **Expo 兼容策略**（□ Expo 官方兼容 / □ config plugin 已测 SDK 版本 / □ 禁止引入）— 空表仅当零第三方原生；与 `07` 对齐 |
| 11 | **环境成对** | staging/prod：`APP_ENV`、API base URL、可选鉴权密钥名；**值不入库**（见 [templates/env.example](./templates/env.example)） |
| 12 | **工作流** | □ **默认 managed**（EAS Build；禁裸 `eject` / 手工维护 `android/`+`ios/` 作默认）□ **CNG / prebuild 定制**（须写明：为何 + 仍走 `expo prebuild`，非永久 eject） |
| 13 | **测试设备** | 至少：1 个 iOS Simulator + 1 个 Android Emulator（或 INPUTS 写明的托管设备）；RNTL / Maestro 跑在哪须写明 |
| 14 | **无障碍 / 性能** | □ 做：可点目标足够大、关键图 `accessibilityLabel`、列表滚动不掉帧作验收项 □ 裁剪：须在 acceptance 写「裁剪：理由」一行 |

## 若适用

| # | 项 |
|---|-----|
| 15 | Web 目标：□ 本仓含 Expo Web □ 仅 native — 含 Web 则须 route 与矩阵在 Web 可验收 |
| 16 | 推送 / 深链：payload → 路由映射 |
| 17 | i18n：locale 列表；文案 SSOT 路径 |
| 18 | 离线缓存：键空间 + 失效策略 |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
