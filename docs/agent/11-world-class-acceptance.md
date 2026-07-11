# 11 — 世界级验收

## A. 工程面（§1.2）

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` |
| 命名 / 词表 | [ ] | `02` Pass1 词表 + tool_name/金标 id |
| 代码风格 | [ ] | §0 经由 language-gates/python.md 与/或 typescript.md + commands lint 绿 |
| 工具链 | [ ] | uv 或 pnpm + lock |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 指南无业务 Agent 实现 |
| 逻辑清晰可测 | [ ] | domain + 探针 |
| 关键路径 | [ ] | `05` |
| 测试 | [ ] | `09` |
| 安全（应用层） | [ ] | 白名单 / 密钥 / 人在环 |
| 无障碍 / 性能 | [ ] | 裁剪：Agent CLI/API 无 UI a11y；性能=超时预算 `03`/`04` |
| 运维第三方 | N/A | **不进必勾** |

## B. 功能共有（≥2 URL）

| 能力 | sources | 勾选 |
|------|---------|------|
| Tool calling Agent | https://github.com/pydantic/pydantic-ai · https://github.com/openai/openai-agents-python | [ ] |
| 结构化输出/校验 | https://github.com/pydantic/pydantic-ai · https://github.com/vercel/ai | [ ] |
| 多步工具循环 | https://github.com/openai/openai-agents-python · https://github.com/vercel/ai | [ ] |
| 可测/示例驱动 | https://github.com/pydantic/pydantic-ai · https://github.com/openai/openai-agents-python | [ ] |
| 提供商可切换 | https://github.com/pydantic/pydantic-ai · https://github.com/vercel/ai | [ ] |
| 权限/安全边界意识 | https://github.com/openai/openai-agents-python · https://github.com/vercel/ai | [ ] |

## C. 达到 / 超越（§1.3）

1. [ ] 能力切条（用户可感知） 
2. [ ] 共有：≥2 证据源 
3. [ ] 功能面 ⊇ 共有 
4. [ ] 工程面 §1.2 有章节+勾选 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中更弱/未见「工具白名单 + 有界 turn 失败终态」硬门闸 → 本指南要求工具白名单与有界 turn 失败终态（见 04/05）` 
 - [ ] a2. `对照：B 中更弱/未见「金标 JSONL + 发版 eval 硬门闸」同构要求 → 本指南要求金标 JSONL 与发版 eval 硬门闸（见 06）` 
 - [ ] b. `09` 矩阵 1–6 已走通 
 - c. N/A（非全 P1w） 

## D. 交付环境

| 项 | 勾选 |
|----|------|
| DEV/PROD 密钥名已给 | [ ] |
| 金标可跑 | [ ] |
