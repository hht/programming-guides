# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。 
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 勾）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `00` 框架 MUST；`01` 单适配器 |
| 工具链 | [ ] | 模板版本化 + HTTP/SDK 选定一家 |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无第二套邮件 SSOT；指南无业务实现 |
| 逻辑清晰可测 | [ ] | `05`/`07`/`09` |
| 关键路径 | [ ] | Transactional Send Lifecycle（`05`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | 密钥不入库；Webhook 验签；模板 HTML escape |
| 无障碍 / 性能 | [ ] | 默认提供 `body_text`；异步路径不阻塞请求预算（INPUTS） |
| 运维第三方 | N/A | **不进必勾**（供应商托管仪表仅参考） |

## B. 功能共有 → 实现仓必做

> 仅 `sources` **共有必做**（用户/运维可感知且 ≥2 源）。应用侧状态机硬必填、模板 SSOT、**应用侧幂等键必填**属 **超越**（§C a1/a2）；实现仓仍须满足 `03`/`06`/`07` / §D。

| 能力 | 何时必勾 | sources（URL） | 勾选 |
|------|----------|----------------|------|
| 经 API 发送事务邮件 | 全 | https://resend.com/docs/api-reference/emails/send-email · https://postmarkapp.com/developer/user-guide/send-email-with-api · https://docs.aws.amazon.com/ses/latest/dg/send-email-api.html | [ ] |
| 投递相关事件（delivered/bounce 等）可消费 | 全 | https://resend.com/docs/dashboard/webhooks/event-types · https://postmarkapp.com/developer/webhooks/bounce-webhook · https://docs.aws.amazon.com/ses/latest/dg/notification-contents.html | [ ] |
| Bounce 后停止继续骚扰无效地址（抑制/移除） | 全 | https://postmarkapp.com/developer/webhooks/bounce-webhook · https://docs.aws.amazon.com/ses/latest/dg/notification-contents.html · https://resend.com/docs/dashboard/webhooks/event-types | [ ] |

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条（用户/运维可感知；非「整站一条」） 
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选 
3. [ ] 功能面达到：指南必做 ⊇ 所有共有 
4. [ ] 工程面：§1.2 有章节 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中模板常为控制台拖拽或示例 HTML 散落 → 本指南要求版本化模板 SSOT + 变量契约，compose 失败不得出站（见 03/05）` 
 - [ ] a2. `对照：B 中幂等常为供应商可选头或短 TTL → 本指南要求应用侧 idempotency_key 必填 + 投递状态机持久化，供应商键为叠加而非唯一去重（见 06/07）` 
 - [ ] b. `09` 发版矩阵适用行 
 - [ ] c. （证据源以 P1w 为主）更硬项均可在已引用公开段落核对：模板/变量、幂等文档、webhook 事件、bounce 内容 

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；供应商互斥已遵守 
- [ ] Transactional Send Lifecycle 单测绿（`05`/`09`） 
- [ ] 幂等 + bounce/complaint 抑制探针绿 
- [ ] Webhook 验签失败不推进状态 
- [ ] staging/prod 密钥与 Webhook 名成对（值不在仓） 
- [ ] 无 setTimeout 伪队列路径 
- [ ] 若异步：workers-queue 验收适用项 + 同幂等键 
