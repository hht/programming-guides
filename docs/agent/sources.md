# 来源、标杆与差距表

## P0

| 主题 | URL |
|------|-----|
| OpenAI function/tools | https://platform.openai.com/docs/guides/function-calling |
| JSON Schema | https://json-schema.org/ |
| Pydantic AI 文档 | https://ai.pydantic.dev/ |
| Vercel AI SDK | https://ai-sdk.dev/docs |

## 标杆 \(B\)（3 开源）

| ID | 仓库 | 品类匹配 | 学什么 | 不学什么 |
|----|------|----------|--------|----------|
| A | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) | 类型安全 Python Agent | tool 类型、输出模型、测试 | 绑死其全部生态插件 |
| B | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) | 轻量多 Agent/工具循环 | handoff、会话、护栏思路 | 必须双语言同 SDK |
| C | [vercel/ai](https://github.com/vercel/ai) | TS Agent/工具/结构化输出 | `tool`/`generateObject`、多步 | 绑死 Next.js 全家桶 |

## 能力切条 → 共有

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| Tool-calling Agent | ✓ | ✓ | ✓ | 必做 |
| 结构化输出 | ✓ | ✓ | ✓ | 必做 |
| 多步工具循环 | ✓ | ✓ | ✓ | 必做 |
| 可测示例 | ✓ | ✓ | ✓ | 必做 |
| 多提供商 | ✓ | ✓ | ✓ | 必做 |
| 安全/护栏意识 | ✓ | ✓ | ✓ | 必做 |

## 差距表

| 缺口 | 落入 | 必做 |
|------|------|------|
| 有界 turn + 白名单 | `04`/`05` | 必做（超越） |
| 金标 JSONL 同构 eval | `06` | 必做（超越） |
| 双栈章节 | `07`/`08` | 必做 |
| 运维第三方 | — | 参考 N/A |

## 冲突

| 冲突 | 裁决 |
|------|------|
| LangChain 下载更高 | **Pydantic AI + AI SDK**（类型与边界） |
| 强制 OpenAI Agents 双语言 | 学能力面；默认栈见 `01` |
