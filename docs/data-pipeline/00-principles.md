# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：常见 Python 宿主 → [python Language Gate](../meta/language-gates/python.md)；本册不复制语言硬门闸。

## 品类

数据按约定抽取→变换→装载→校验；可重放；未通过校验不得标成功。

## 核心正确性路径（全文唯一）

**Batch Job Lifecycle**：extract → transform → load → verify。规格见 [05](./05-batch-job-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 批处理默认；流式须 INPUTS 明示 | INPUTS |
| F02 | MUST | Runner 默认=workers-queue | `08`+workers-queue |
| F03 | MUST | 每次 BatchRun 必有 idempotency_key | `03` |
| F04 | MUST | 四步不可跳；verify 失败不得对外可用 | `05`/`07` |
| F05 | MUST | 默认 at-least-once；装载可重入 | `06` |
| F06 | MUST NOT | 无幂等宣称 exactly-once | 同上 |
| F07 | MUST | 仅 verify 全过 → succeeded | `07` |
| F08 | MUST NOT | 裸 cron+无状态脚本冒充生产管线 | `11` |
| F09 | MUST | deletion-first | 目录 |

## SSOT

| 真相 | Owner |
|------|--------|
| 源/目标 / Runner / 校验清单 | `INPUTS.md` |
| Dataset / BatchRun | `03` + templates |
| 抽取 | `04` |
| Lifecycle | `05` |
| 变换与装载 | `06` |
| 校验 | `07` |
| Runner / 流式 | `08` |
| Job 重试/死信 | [workers-queue](../workers-queue/README.md) |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md` |
