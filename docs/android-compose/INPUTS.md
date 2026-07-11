# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写 Android 实现**。  
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL/字段表/P0）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **应用标识** | `applicationId`（如 `com.example.app`）+ 展示名；minSdk **默认 26**（改则写死数字 + 理由） |
| 2 | **设计稿** | frame/screen 清单：至少 1 个主任务流；每屏含 **loading / empty / error / success**（或书面 N/A 谓词） |
| 3 | **UI 状态矩阵** | 填齐 [templates/ui-state-matrix.md](./templates/ui-state-matrix.md)（每路由/目的地 × 态）；缺行 → BLOCKED |
| 3b | **HTTP 客户端（若有网络）** | □ **Retrofit+OkHttp**（默认）□ Ktor Client（仅书面迁移理由） |
| 4 | **API / 契约** | base URL staging/prod 成对；错误码表至少：`NETWORK` / `UNAUTHORIZED` / `NOT_FOUND` / `VALIDATION` / `UNKNOWN` → 用户可见行为 |
| 5 | **鉴权（若有）** | □ 无 □ 对接 [docs/auth](../auth/README.md) 模式（写模式字母）□ 其它（须钉 token 存放：默认 **EncryptedSharedPreferences / 系统凭证**；**禁**明文 SharedPreferences 存 session） |
| 6 | **导航图** | 起始目的地 + 主图路由表（route id / args）；深链若有则列 URI 模式 |
| 7 | **UiState 边界** | 每屏（或共享）**一个** `XxxUiState` data class 名（词表）；禁第二套平行 state 源 |
| 8 | **配置变更策略** | 每屏勾选：□ 仅 ViewModel 存活即可 □ 须 SavedStateHandle 键（列键名）□ 须 DataStore/磁盘恢复（列键）— 与 `07` 对齐 |
| 9 | **环境成对** | staging/prod：`APP_ENV`、API base URL、可选鉴权密钥名；**值不入库**（见 [templates/env.example](./templates/env.example)） |
| 10 | **DI** | □ **默认**：构造注入 / 简单工厂（无 Hilt）□ **Hilt**（须书面：模块边界 + 测试替身策略） |
| 11 | **测试设备** | 至少：1 个 emulator API 级 + 1 个物理或第二 API；Compose UI Test 跑在哪写死 |
| 12 | **无障碍 / 性能** | □ 做：触控目标 ≥48dp、关键文案 `contentDescription`、首屏帧预算（默认 jank 不连续掉帧）□ 裁剪：须在 acceptance 写「裁剪：理由」一行 |

## 若适用

| # | 项 |
|---|-----|
| 13 | 多模块：`:app` / `:feature:*` / `:core:*` 边界表 |
| 14 | 离线缓存 / Room：实体词表 + 失效策略 |
| 15 | 推送 / 深链：payload → 导航映射 |
| 16 | i18n：locale 列表；文案 SSOT 路径 |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
