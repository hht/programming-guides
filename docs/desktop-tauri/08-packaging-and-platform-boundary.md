# 08 — 打包与平台边界

## 不变量

- 发版产物按 INPUTS §2 OS 裁剪；未勾选的 OS **不进**必做发版矩阵。 
- **Mac 原生主路径** = [apple-platforms](../apple-platforms/README.md)；本册打包不等于「取代 SwiftUI Mac」。 
- 签名 / 公证 / SmartScreen 等按平台文档；密钥不入库。

## 步骤规格（实现自写）

1. **构建** 
 - `pnpm tauri build`（或官方等价）；CI 按 OS matrix。 
 - 前端生产构建进 `frontendDist`；禁打包进 `.env` 秘密。

2. **标识与版本** 
 - `identifier`、版本号与变更记录策略写明；与更新通道（若有）一致。

3. **自动更新（若 INPUTS §15）** 
 - 端点 staging/prod 成对；验签公钥策略须写明；失败 → 可继续用旧版，不崩主流程。 
 - 未启用 → 本章更新节 N/A。

4. **平台差异** 
 - 路径、文件对话框、全局快捷键：经 capability + command，避免 `#ifdef` 散落前端。 
 - Linux 额外依赖（WebView）写入实现仓 README 运维说明（非第三方 APM 必勾）。

5. **与 apple-platforms 边界表**

| 需求 | 走哪 |
|------|------|
| 仅 Mac，要原生菜单/多窗 HIG 深度 | apple-platforms |
| 必须 Win/Linux 同仓 | 本册 |
| 两套都交 | 双壳；词表与领域逻辑共享，禁业务分叉 |

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 签名失败 | CI 红；不发「未签名当正式」 |
| 更新校验失败 | 跳过更新；记日志 |
| 未勾选 OS 的 job | 不跑 / N/A |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| build 产物 | 含标识与版本 |
| 更新关 | 无强制更新依赖 |
| INPUTS 仅 macOS | Windows job N/A |
