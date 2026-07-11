# 11 — 世界级验收

## A. 工程面（元指南 §1.2 必做维）

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | `02` Pass1 UBIQUITOUS_LANGUAGE + 协议字段冻结 |
| 代码风格 | [ ] | `01` 钉栈 |
| 工具链 | [ ] | Vite 脚手架 + lockfile |
| 门禁 | [ ] | `commands.md`：PR `check` / 发版 e2e |
| 代码极简 | [ ] | 指南无业务实现；deletion-first |
| 逻辑清晰可测 | [ ] | domain 纯函数 + `09` 单测表 |
| 算法 / 关键路径 | [ ] | `05` 钱路径 |
| 测试 | [ ] | case→期望 + 发版场景×断言 |
| 安全（应用层） | [ ] | `08.1–8.2`；会话/授权 |
| 无障碍 / 性能预算 | [ ] | 裁剪：理由=DApp 以钱路径正确性优先；或自订 LCP/INP 预算 |
| 运维 / 第三方可观测 | N/A | **不进必勾**（Sentry 等仅 `08` 参考） |

## B. 功能面共有（§1.3；sources URL 见 [sources.md](./sources.md)）

| 能力 | sources | 勾选 |
|------|---------|------|
| 连接钱包 / 切链 | A,B,C | [ ] |
| 主钱路径写（Swap 或 INPUTS 标注等价） | A,B,C | [ ] |
| 代币授权 | A,B,C | [ ] |
| 交易态 pending/success/fail | A,B,C | [ ] |
| 报价/预览后再提交 | A,B,C | [ ] |
| 多环境地址/RPC | A,B,C | [ ] |

## C. 「达到 / 超越」勾选（复制元指南 §1.3）

1. [ ] 能力切条：差距表功能行均为用户可感知能力  
2. [ ] 共有判定：必做 ⊇ \(B\) 中 ≥2 源共有  
3. [ ] 功能面达到：上表共有项均交付  
4. [ ] 工程面达到：§A 必做维均有章节 + 本页勾选  
5. [ ] **超越 a+b**：  
   - [ ] a. ≥2 条更硬不变量（见下方）  
   - [ ] b. 发版场景×断言矩阵（`09`）  
   - c. 全 P1w 时才适用（本指南 \(B\) 为开源，**N/A**）

### 超越 a（对照句）

1. `对照：B 中常见「有 hash 即当成功」更弱 → 本指南要求 receipt.status==='success' 才成功；hash≠成功`  
2. `对照：B 中少见 unknown 禁止重提 → 本指南要求超时/未知 latch + fail-closed，禁止一键解锁`

## D. 交付门闸（项目勾选）

- [ ] INPUTS OK；实现在目标仓  
- [ ] 写路径 simulate→write(request)→wait；inflight+latch；双 chainId  
- [ ] 地址表 + generate ABI；禁写 implementation  
- [ ] walletReady ≠ sessionReady（若有后端）  
- [ ] 每页三态 DoD；文案 i18n  
- [ ] `pnpm check`=0；发版 e2e=0（INPUTS 书面豁免须附风险；默认不豁免）  
- [ ] 环境成对（staging/prod API+地址+RPC）  
