# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。 
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 勾；条件行见 B）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `00` 框架 MUST；`01` 适配器边界 |
| 工具链 | [ ] | 供应商客户端版本；跟应用册 |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无第二套内容状态 SSOT；指南无业务实现 |
| 逻辑清晰可测 | [ ] | `05`/`06`/`09` |
| 关键路径 | [ ] | Content Publish Lifecycle（`05`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | Delivery/Preview 分离；preview token 不下发公开前端 |
| 无障碍 / 性能 | [ ] | 裁剪或：公开页跟应用册 a11y；Delivery p95 预算可选（默认超时 5s） |
| 运维第三方 | N/A | **不进必勾**（CMS Dashboard / APM 仅参考） |

## B. 功能共有 → 实现仓必做

> 仅 `sources` **共有必做**（用户可感知且 ≥2 源）。Delivery/Preview 硬分离与应用投影属 **超越**，见 §C。

| 能力 | 何时必勾 | sources（URL） | 勾选 |
|------|----------|----------------|------|
| 编辑者可保存草稿且草稿不对外公开 | 全 | https://payloadcms.com/docs/versions/drafts · https://docs.strapi.io/cms/features/draft-and-publish · https://www.contentful.com/developers/docs/concepts/draft-and-published/ | [ ] |
| 发布前有校验 / 必填约束（失败不可当已发布） | 全 | https://payloadcms.com/docs/versions/drafts · https://docs.strapi.io/cms/features/draft-and-publish · https://www.contentful.com/developers/docs/concepts/data-model/ | [ ] |
| 发布后访客可经 Delivery/公开 API 读到内容 | 全 | https://payloadcms.com/docs/versions/drafts · https://docs.strapi.io/cms/api/rest/status · https://www.contentful.com/developers/docs/concepts/apis/ | [ ] |
| 撤回/取消发布后公开面不可再读（契约内） | 全 | https://payloadcms.com/docs/versions/drafts · https://docs.strapi.io/cms/features/draft-and-publish · https://www.contentful.com/developers/docs/concepts/draft-and-published/ | [ ] |
| Webhook 驱动缓存失效 | **条件** — 仅 INPUTS §9 启用 webhook | 各供应商 webhook 文档；非共有必做 | [ ] / N/A |

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条（用户可感知；非「整站一条」） 
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选 
3. [ ] 功能面达到：指南必做 ⊇ 所有共有 
4. [ ] 工程面：§1.2 有章节 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中部分演示流用同一 token 读 draft+published 或未强制发布前校验 → 本指南要求 Delivery/Preview 凭据分离，且 publish 必须先过 validate（见 05/06/08）` 
 - [ ] a2. `对照：B 中常把 CMS 原始 JSON 直接当页面模型 → 本指南强制经 CmsAdapter 投影为应用 ContentDocument，SDK 类型不进 features/ 状态机（见 03/04/08）` 
 - [ ] b. `09` 发版矩阵适用行 
 - c. N/A（证据源含开源仓，非全 P1w） 

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；供应商互斥已遵守 
- [ ] Content Publish Lifecycle 单测绿（`05`/`09`） 
- [ ] 公开 Delivery 无 draft；preview 分离探针绿 
- [ ] staging/prod token 成对（值不在仓） 
- [ ] 无双 CMS SSOT；无 preview token 进公开 bundle 
- [ ] 缓存/TTL 或 webhook 失效已按 INPUTS 接线 
