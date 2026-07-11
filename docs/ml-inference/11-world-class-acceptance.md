# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。 
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 勾）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `01` 单 runtime；禁训练百科进主路径 |
| 工具链 | [ ] | FastAPI + lockfile；artifact 版本配置 |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无第二套推理 SSOT；指南无业务实现 |
| 逻辑清晰可测 | [ ] | `05`/`06`/`09` |
| 关键路径 | [ ] | Inference Request Lifecycle（`05`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | 密钥不入库；authorize 先于 infer；错误无密钥/路径泄露 |
| 无障碍 / 性能 | [ ] | 超时与配额数字可验收；裁剪须写「裁剪：理由」 |
| 运维第三方 | N/A | **不进必勾**（GPU 集群仪表仅参考） |

## B. 功能共有 → 实现仓必做

> 仅 `sources` **共有必做**（用户可感知且 ≥2 源）。与 `sources` 共有表同构。authorize 硬门闸、配额硬门闸属 **超越**（§C a1/a2）；实现仓仍须满足 `05`/`06`/`08` / §D。

| 能力 | 何时必勾 | sources（URL） | 勾选 |
|------|----------|----------------|------|
| 经 HTTP 对已加载模型做推理并返回结果 | 全 | https://docs.bentoml.com/en/latest/build-with-bentoml/services.html · https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html · https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/protocol/http.html | [ ] |
| 服务侧可配置请求超时 | 全 | https://docs.bentoml.com/en/latest/reference/bentoml/configurations.html · https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html · https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/model_configuration.html | [ ] |
| 以显式模型身份/版本提供服务（非无名黑盒） | 全 | https://docs.bentoml.com/en/latest/build-with-bentoml/model-loading-and-management.html · https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html · https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/model_repository.html | [ ] |
| 输入 schema / 类型校验 | 全 | https://docs.bentoml.com/en/latest/build-with-bentoml/iotypes.html · https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/model_configuration.html | [ ] |

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条（用户可感知；非「整站一条」） 
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选 
3. [ ] 功能面达到：指南必做 ⊇ 所有共有 
4. [ ] 工程面：§1.2 有章节 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中示例常弱化或省略请求级 authorize，或把鉴权留给未文档化的网关 → 本指南要求 authorize 为 Lifecycle 步骤 1，失败不得 validate/infer，并有未授权探针（见 05/06）` 
 - [ ] a2. `对照：B 中超时常见、配额常缺或仅运维层 → 本指南要求超时与配额同为硬门闸，分码 + 发版矩阵（见 06/08/09）` 
 - [ ] b. `09` 发版矩阵适用行 
 - c. N/A（证据源含开源仓，非全 P1w）

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；runtime 互斥与 artifact 版本已遵守 
- [ ] Inference Request Lifecycle 单测绿（`05`/`09`） 
- [ ] 未授权 / 校验失败 / 配额 / 超时探针绿 
- [ ] 成功响应含实际 `artifact_version`；生产无裸 `latest` 
- [ ] staging/prod 配置名成对（值不在仓） 
- [ ] 无训练主路径冒充推理验收 
- [ ] fake runtime；CI 无巨权重下载 
