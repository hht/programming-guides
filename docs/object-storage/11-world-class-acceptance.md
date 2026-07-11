# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。 
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 勾）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `01` 显式 S3 客户端；禁双 SSOT |
| 工具链 | [ ] | 语言默认 SDK + 本地 MinIO |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无第二套存储产品 SSOT；指南无业务实现 |
| 逻辑清晰可测 | [ ] | `05`/`07`/`09` |
| 关键路径 | [ ] | Object Put Lifecycle（`05`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | 私有默认；无前端长期密钥；authorize 门闸 |
| 无障碍 / 性能 | [ ] | 裁剪：上传 UI a11y 随应用 UI 册；大小/TTL 预算见 INPUTS |
| 运维第三方 | N/A | **不进必勾**（云监控/厂商控制台仅参考） |

## B. 功能共有 → 实现仓必做

> 仅 `sources` **共有必做**（用户可感知且 ≥2 源）。

| 能力 | 何时必勾 | sources（URL） | 勾选 |
|------|----------|----------------|------|
| 上传对象（Put / 等价） | 全 | https://github.com/minio/minio · https://github.com/aws/aws-sdk-js-v3 · https://github.com/minio/minio-js | [ ] |
| 下载对象（Get / 预签名 Get） | 全 | https://github.com/minio/minio · https://github.com/aws/aws-sdk-js-v3 · https://github.com/minio/minio-js | [ ] |
| 私有桶 / 授权访问（非默认公开） | 全 | https://github.com/minio/minio · https://github.com/aws/aws-sdk-js-v3 · https://github.com/minio/minio-js | [ ] |
| 删除对象 | 全 | https://github.com/minio/minio · https://github.com/aws/aws-sdk-js-v3 · https://github.com/minio/minio-js | [ ] |

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条（用户可感知；非「整站一条」） 
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选 
3. [ ] 功能面达到：指南必做 ⊇ 所有共有 
4. [ ] 工程面：§1.2 有章节 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中常见「直接 Put / 示例跳过授权」或客户端自选 key → 本指南要求 authorize 先于 put/presign，且 object key 由服务端授权意图决定（见 04/05）` 
 - [ ] a2. `对照：B 中更弱/未见「写入后强制 verify 才提交业务已上传」→ 本指南要求 verify 成功前不得标业务可用，并有探针（见 07/09）` 
 - [ ] b. `09` 发版矩阵适用行 
 - c. N/A（证据源含开源仓，非全 P1w） 

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；客户端语言表已遵守 
- [ ] Object Put Lifecycle 单测绿（`05`/`09`） 
- [ ] 私有读 / 无前端长期密钥探针绿 
- [ ] staging/prod endpoint 与凭证成对（值不在仓） 
- [ ] 本地 MinIO 可跑通 Lifecycle 
- [ ] 无云厂商百科分叉业务路径 
