# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| Design Tokens Community Group — 格式与规范入口 | https://www.designtokens.org/ |
| W3C Design Tokens / DTCG（社区组与格式讨论） | https://github.com/design-tokens/community-group |
| Style Dictionary — 文档与 DTCG 源 | https://styledictionary.com/ |
| Style Dictionary — tokens / config 参考 | https://github.com/style-dictionary/style-dictionary |

## 标杆 B（开源 P1）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [style-dictionary/style-dictionary](https://github.com/style-dictionary/style-dictionary) | P1 | DTCG 源、多平台 transform、css/variables | 把示例主题当产品品牌；双配置并行 | 工程变换流水线 |
| B | [design-tokens/community-group](https://github.com/design-tokens/community-group) | P1 | `$value`/`$type`、跨工具交换 | 当作唯一运行时；代替 SD | 源格式标准 |
| C | [primer/design](https://github.com/primer/design) | P1 | 设计 token 文档化、主题/模式叙述 | GitHub 产品业务；绑死 Primer 色名 | 设计侧 token 文档与主题 |

映射学习（非 B 共有证据源、不钉默认）：Material Design Tokens 文档、Tokens Studio、历史 `amzn/style-dictionary` 镜像——仅对照；**正式变换仍钉现行 Style Dictionary**。

## 共有能力切条（用户可感知）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 单一源定义 token | ✓ | ✓ | ✓ | **必做** |
| UI/主题按语义消费（非魔法值） | ✓ | — | ✓ | **必做**（≥2：A+C；B 为格式规范，非产品消费面） |
| 文档化 token / 主题模式 | ✓ | ✓ | ✓ | **必做** |
| 商业 token SaaS / 插件百科 | — | — | — | **参考**；禁当正文 |
| 第二套平行色名词汇 | — | — | — | **禁止** |

> **共有必做**仅上表用户可感知且 ≥2 **真公开**能力。  
> **变换到可消费样式/平台产物**：仅 A（Style Dictionary）为产品变换流水线；B（community-group）是格式规范仓、**不可**打变换 ✓ → **不进共有**，见差距表「Style Dictionary 变换」必做。  
> 色名唯一 + 设计/工程路径同名 **不进共有**（示例常省略）→ 见差距表「超越」与 `11` §C。  
> **Material Design Tokens 非标杆 B**，不作共有证据源（仅映射学习）。

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做 |
|------|------|------|------|------|
| Token Apply Lifecycle 编号步骤 | 工程正确性 | 功能 | `05` | 必做 |
| DTCG 源格式 | B + P0 | 工程 | `01`/`04` | 必做 |
| Style Dictionary 变换 | A + P0 | 工程 | `01`/`06` | 必做 |
| UI 语义消费 | A,C | 功能 | `07` | 必做 |
| 禁第二套色名 + lint | 超越 a1 | 工程 | `03`/`07`/`09` | 超越（指南硬） |
| ui-ux 路径同名 drift | 超越 a2 | 工程 | `04`/`08` | 超越（指南硬） |
| 对位 ui-ux | 本仓 | 工程 | `08` + ui-ux | 必做（对接时） |
| 商业 token 云同步百科 | — | 参考 | — | 参考；禁当正文 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| Tokens Studio / 仅 Figma 插件更「设计向」 | **工程正式路径钉 Style Dictionary**；Figma 为源边界 |
| DTCG vs Style Dictionary 旧 JSON | **钉 DTCG**；旧格式仅迁移窗口 |
| ui-ux `tokens.md` vs 工程 DTCG | **运行时/build SSOT = DTCG**；md 为人读/设计对接 |
| 流行手写 theme.css | 仅当其为 **SD 唯一产物**；禁第二人手维护色表 |
| 先进性 vs 下载量 | **DTCG + SD**；下载量不单独定胜负 |
| Material / Primer 色角色名 | 可作**映射学习**；实现仓消费名以本册 INPUTS 色名表为准，禁双正式词表 |
