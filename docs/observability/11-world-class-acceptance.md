# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。  
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 信号勾；条件行见 B）。  
> **提醒**：本册为路线图**可选册**；其他领域指南仍不把 APM 当必勾。本册 §B **必须是用户可感知能力**（如出错可凭 id 追查），**禁止**「已安装 Sentry/Datadog」类勾选项。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `01` 显式 OTel；禁双默认遥测框架 |
| 工具链 | [ ] | OTel SDK + OTLP；JSON 日志 |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无平行字段方言；无业务堆进指南 |
| 逻辑清晰可测 | [ ] | `05`/`09` |
| 关键路径 | [ ] | Telemetry Correlate Lifecycle（`05`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | PII/密钥红线；无 token 入日志 |
| 无障碍 / 性能 | [ ] | 裁剪：无产品 UI a11y；采样/基数预算见 INPUTS |
| 运维第三方（商业 APM） | N/A | **不进必勾**（可选参考接入不得替代 §B） |

## B. 功能共有 → 实现仓必做（用户可感知）

> 来源共有判定见 `sources.md`。下列能力写成**可感知结果**，不是供应商安装状态。

| 能力（用户/运维可感知） | 何时必勾 | sources（URL） | 勾选 |
|-------------------------|----------|----------------|------|
| **出错可凭 correlation / request id 追查到同请求日志** | **勾了 logs**（本册默认必勾 logs+traces；与 sources / `05` 同构） | https://opentelemetry.io/docs/ · https://github.com/open-telemetry/opentelemetry-demo · https://github.com/grafana/faro | [ ] / N/A |
| **跨服务/出站调用后仍能用同一追踪线索跟随**（trace 或传播后的 id） | **勾了 traces** 或跨服务（本册默认必勾 traces） | https://github.com/open-telemetry/opentelemetry-demo · https://opentelemetry.io/docs/concepts/context-propagation/ | [ ] / N/A |
| **延迟/错误可用稳定指标名观察**（非一次性临时打点） | **勾了 metrics**（可选） | https://opentelemetry.io/docs/concepts/signals/metrics/ · https://github.com/open-telemetry/opentelemetry-demo | [ ] / N/A |
| **结构化日志可机读关联**（JSON 字段，非纯文本糊墙） | **勾了 logs**（本册默认必勾） | https://github.com/open-telemetry/opentelemetry-demo · https://grafana.com/oss/faro/ | [ ] / N/A |
| ~~已安装 Sentry / 某商业 APM~~ / ~~仅 metrics 冒充关联~~ | — | — | **禁止作为本表行** |

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条（用户可感知，非供应商）  
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选  
3. [ ] 功能面达到：指南条件必做 ⊇ 所有共有  
4. [ ] 工程面：§1.2 有章节  
5. [ ] 超越 a+b：  
   - [ ] a1. `对照：B 中更弱/未见「三类信号必须带同一可查询相关 ID」硬门闸 → 本指南要求 emit 后 propagate，且 query/alert 以该 ID 可关联（见 05）`  
   - [ ] a2. `对照：B 中更弱/未见「metrics label 基数白名单+上限」硬门闸 → 本指南要求登记表白名单与无界维禁入（见 07）`  
   - [ ] b. `09` 发版矩阵适用行  
   - c. N/A（证据源含开源仓，非全 P1w）  

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；信号裁剪已遵守（logs+traces 必勾；metrics 可选；禁仅 metrics）  
- [ ] `05` 生命周期适用步单测绿（含错误可追查 id）  
- [ ] `09` 矩阵适用行  
- [ ] staging/prod OTLP（若启用）与 `APP_ENV` 成对（值不在仓）  
- [ ] 验收叙述**未**用「已装 Sentry」代替关联探针  
