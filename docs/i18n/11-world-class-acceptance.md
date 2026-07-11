# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。  
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 勾）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `01` 显式宿主运行时；禁双 SSOT |
| 工具链 | [ ] | JSON/ICU + next-intl 或 react-intl |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无第二套文案格式 SSOT；指南无业务实现 |
| 逻辑清晰可测 | [ ] | `05`/`08`/`09` |
| 关键路径 | [ ] | Locale Resolve Lifecycle（`05`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | 翻译串不默认 `dangerouslySetInnerHTML`；无密钥进目录 |
| 无障碍 / 性能 | [ ] | `lang`/`dir`；消息分片预算可选；裁剪须一行理由 |
| 运维第三方 | N/A | **不进必勾**（翻译 SaaS / TMS 仅参考） |

## B. 功能共有 → 实现仓必做

> 仅 `sources` **共有必做**（用户可感知且 ≥2 源）。与 `sources` 共有表同构。**缺 key fail** 仅 §C 超越 a1，不进本表；**禁止**用 i18next 静默回退作共有证据。

| 能力 | 何时必勾 | sources（URL） | 勾选 |
|------|----------|----------------|------|
| 按 locale 加载并显示本地化文案 | 全 | https://github.com/formatjs/formatjs · https://github.com/i18next/i18next · https://github.com/amannn/next-intl | [ ] |
| 切换 / 进入另一 locale 后文案更新 | 全 | https://github.com/formatjs/formatjs · https://github.com/i18next/i18next · https://github.com/amannn/next-intl | [ ] |
| 变量 / 复数 / 选择句可读（ICU） | 全 | https://github.com/formatjs/formatjs · https://github.com/amannn/next-intl · https://unicode-org.github.io/icu/userguide/format_parse/messages/ | [ ] |

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条（用户可感知；非「整站一条」）  
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选  
3. [ ] 功能面达到：指南必做 ⊇ 所有共有  
4. [ ] 工程面：§1.2 有章节  
5. [ ] 超越 a+b：  
   - [ ] a1. `对照：B 中常见缺 key 回退显示 key 名或静默 fallback 默认 locale → 本指南要求 missing-key fail（dev 抛错 + CI 红灯 + prod fail-loud），并有探针（见 08/09）`  
   - [ ] a2. `对照：B 中示例常在 JSX 内硬编码英文 → 本指南要求用户可见串经消息 key，硬编码 lint/门禁红灯（见 03/08）`  
   - [ ] b. `09` 发版矩阵适用行  
   - c. N/A（证据源含开源仓，非全 P1w）  

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；宿主运行时表已遵守  
- [ ] Locale Resolve Lifecycle 单测绿（`05`/`09`）  
- [ ] `check-messages` + `check-hardcoded` 绿  
- [ ] 无静默缺 key；无未声明 i18next 默认  
- [ ] staging/prod locale 列表与默认成对  
- [ ] 与 react/nextjs 册对接时文案 SSOT 在本册路径  
