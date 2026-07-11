# 语言工程契约 — 落盘方案

> **状态**：正式规格（契约 Full **5/5 PASS**，2026-07-11）。  
> **问题**：编程语言规范应如何落入本仓。  
> **相关**：[AGENTS.md](../../AGENTS.md) · [how-to-write-guides.md](./how-to-write-guides.md) §1.2 · [naming-business-first.md](./naming-business-first.md) · [adversarial-review.md](./adversarial-review.md) · [language-gates/README.md](./language-gates/README.md)。

---

## 0. 最高准则（凌驾一切语言习惯法）

本仓语言规范的**裁决序**规定为：

```text
代码极简 > 逻辑清晰可测试 > 算法精妙 > 其余（格式/linter/Google Style…）
```

| 准则 | 操作定义（可勾） | 禁止误解 |
|------|------------------|----------|
| **代码极简** | 见下方 **§0.1 deletion-first 硬规**；无死代码；能少一层就少一层 | ≠ 缺省错误处理；≠ 为短而短牺牲正确性 |
| **逻辑清晰可测试** | 领域规则可纯函数/表驱动；每条硬门闸有 case→期望或 rule id；禁假成功、禁隐式控制流当默认 | ≠ 测试数量崇拜；≠ 为 mock 方便扭曲设计 |
| **算法精妙** | 关键路径选**正确且充分简单**的算法/数据结构；复杂度有据；**必须**有用探针验证行为 | ≠ 炫技/冷门语法表演；与 AGENTS「清晰 > 精巧」一致：**精妙＝恰到好处的正确算法，不是卖弄** |

### 0.1 deletion-first 硬规（极简的可执行子集）

| # | 规约 | 探针 / 判据 |
|---|------|-------------|
| D1 | **MUST**：删除不可达、无引用、仅「以后可能用」的代码/文件/依赖/配置；恢复靠 git，**MUST NOT** 用大段注释代替删除 | PR/`check`：死代码门闸（语言对应 linter unused / 等价）或评审列出「保留理由」一行；无理由 = FAIL |
| D2 | **MUST NOT** 保留可删除的封装层：若去掉某一 wrapper / Helper / Manager / 中间 interface，调用方仍能完成**同一用户可观察行为** → 直接调下一层 | 设计/实现评审：画出「删掉该类型后是否仍一行调用可达」；仍可达却保留 = FAIL |
| D3 | **MUST**：仅当出现 **≥2** 处稳定重复 **且** 有独立不变式/失败分类要单测时，才允许抽函数/类型；**MUST NOT**「先封装再等调用方」 | 新类型 PR 须写：重复次数或不变式一句；否则删 |
| D4 | **MUST NOT** 为「完整性」在 `language-gates` 或应用册堆未使用章节/门闸；能合并进已有节则 **MUST** 合并 | 对抗：无探针的门闸、无挂靠册的 gate 段落 → 删 |

**冲突裁决**：

1. Google / Airbnb / 流行 blog 与 §0 冲突 → **§0 胜**，冲突表写「不采用」+ why。 
2. Formatter/linter 导致更多 wrapper/样板才能「绿」→ **改配置或关规则**，勿为绿而绿。 
3. 「算法精妙」与「极简」冲突：先正确性探针，再按 D1–D3 删到不可再删；禁止用精妙当增码/增层借口。 
4. D2 与「可测」冲突时：优先把探针挂在**真正有不变式的那一层**，不为此再包一层「可测 Facade」。

元指南 §1.2 已有「代码极简 / 逻辑清晰可测 / 算法·关键路径」三行——本契约是其在**语言层**的落盘方式；应用册 Lifecycle 仍管品类正确性路径。

### 0.2 规范用词（硬门闸 MUST 可判定）

语言契约与 `language-gates/<lang>.md` 的**硬门闸正文**采用 [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119) 关键词（全文大写）。中文说明可跟在关键词后，但**不得**用含糊语气代替关键词。

| 关键词 | 别名（表头可用） | 含义 | 违反时 |
|--------|------------------|------|--------|
| **MUST** | **DO** | 必做；无例外除非同行写明例外条件 | 齐套 / `check` / 对抗 → **FAIL** |
| **MUST NOT** | **DO NOT** | 禁止；同上 | **FAIL** |
| **SHOULD** | — | 强烈建议；偏离须在 PR/INPUTS **写明一行理由** | 无理由 → FAIL；有理由 → 可过 |
| **SHOULD NOT** | — | 强烈不建议；同上 | 同上 |
| **MAY** | — | 允许；不作门禁失败条件 | 不单独导致 FAIL |

**硬门闸书写规则：**

1. 每条硬门闸的「规约」列 **MUST** 以 `MUST` / `MUST NOT` / `SHOULD` / `SHOULD NOT` / `MAY` 之一起句（或表头分栏为 DO / DO NOT）。 
2. **禁止**仅用「宜」「尽量」「最好」「推荐」「prefer」「ideally」写硬门闸；此类词只许出现在非门闸说明段。 
3. DO / DO NOT 与 MUST / MUST NOT **同义**；同一文件内 **MUST** 二选一风格并写在 Gate 文首「规范用词」一行（例：`Normative: MUST/MUST NOT`）。 
4. 探针列 **MUST** 能判定该关键词是否被满足（命令 exit、单测 case、或可勾谓词）。

**例句（合格）：**

```text
MUST: 公开 API 的错误路径返回类型化 Result/等价，禁止抛未文档化的裸异常作为唯一信号。
MUST NOT: 为通过 lint 而增加无调用方的 wrapper / Facade。
SHOULD: 模块公开入口 ≤ 一处构造函数/工厂；更多入口须写明理由。
```

**例句（不合格 → 不得进硬门闸表）：**

```text
尽量避免过度封装。
Ideally prefer early returns.
推荐使用有意义的变量名。
```

---

## 1. 品类一句话

为每门默认栈语言落一份**薄闸**：用最少机械规则，强制产出**极简、可测、算法得当**的代码；formatter/linter 只做仆人，不写语言百科，不抢 Pass1 业务词表。硬规则用 §0.2 的 MUST / MUST NOT（或 DO / DO NOT）书写。

## 2. 核心正确性路径

**Language Gate Lifecycle**（须按 1–7 顺序执行；与 §5/§9 同序）：

| # | 步骤 | 规格 |
|---|------|------|
| 1 | **选语言层** | 随应用册默认栈；双语言 → 各跑 2–7 |
| 2 | **写 gate 至齐套** | 满足 §5；硬门闸须映射 §0 三准则（见 §3.3） |
| 3 | **Focused 对抗 gate** | 判定句 §8；**Focused B+E**；未 PASS 不得挂靠 |
| 4 | **挂靠应用册** | 按 §3.4 改 `01`/`commands`/`11` |
| 5 | **字符串门禁** | 指南仓：commands ↔ gate **逐字一致**；应用仓实现时 `lint`/`fmt` exit 0 |
| 6 | **应用册 Full** | adversarial **Full 5/5** |
| 7 | **登记** | `language-gates/README.md`=`PASS`（**仅此时**） |

### 失败分类

| 情况 | 行为 |
|------|------|
| Focused 未 PASS | 禁止挂靠 |
| 命令字符串不一致 | 阻断登记 |
| 硬门闸未映射 §0 三准则 / 无探针 | 阻断齐套 |
| fmt/lint 双开口 | 阻断齐套 |
| 为「风格绿」增加样板、降低可测性 | **FAIL**（违极简/可测） |
| 应用册 Full 未 PASS | 阻断登记；优先改应用册规格；仅当 BLOCKER 在 gate 时改 gate |
| 步骤 3 前改 README=PASS | 违规 |

---

## 3. 落盘形态

| 选项 | 结论 |
|------|------|
| 语言百科全套 00–11 / Google 全书入库 | **否** |
| **薄契约 + `meta/language-gates/` + 挂靠应用册** | **是** |

### 3.1 目录

```text
docs/meta/
 language-engineering-contract.md
 language-gates/
 README.md # lang → 状态 → 挂靠册
 typescript.md | go.md | python.md | rust.md | kotlin.md | swift.md
```

禁止平行「仅语言规范」百科册；不禁止已有 `docs/go` 等**应用品类**册。

### 3.2 SSOT 边界

| 层 | Owner |
|----|--------|
| Pass1 业务词 / Pass2 大小写表 | 应用册 `02` + naming-business-first |
| §0 三准则 + fmt/lint/硬门闸 | **本契约 + `language-gates/<lang>.md`** |
| 品类 Lifecycle | 各应用册 `05` 等 |

Gate **禁止**再写 camel/snake 对照表。

### 3.3 Gate 骨架

```markdown
# <Lang> — Language Gate

> Normative: MUST / MUST NOT（RFC 2119；DO / DO NOT 同义，本文件统一用 MUST）

## 适用范围
- 应用册：…

## 最高准则映射（必填）
| 准则 | 本语言如何落实（≤5 条硬门闸 ID） |
| 极简 | G01, G02, … |
| 清晰可测 | G… |
| 算法精妙 | G…（关键路径/复杂度/探针；无则写 N/A+理由） |

## Formatter / Linter（仆人；互斥任选）
| 角色 | 工具 | 命令字符串 | 配置落点 |
| fmt | … | `…` | … |
| lint | … | `…` | … |

## 硬门闸（1–30；每条归属 §0 之一；规约 MUST 含规范关键词）
| ID | 归属准则 | 关键词 | 规约 | 探针 |
| G01 | 极简 | MUST NOT | … | `lint` rule … / 单测 … |
| G02 | 清晰可测 | MUST | … | case → 期望 |
| G03 | 算法精妙 | SHOULD | … | 基准/复杂度注释 + … |

## 命名边界
- Pass1/Pass2 → 应用册 02；本文件不写大小写表

## 证据与冲突
| 来源 | 采用? | why（相对 §0） |

## 接入检查
- [ ] 01 已链接 [ ] commands 逐字一致 [ ] 11 = 固定句
- [ ] 每条硬门闸含 MUST/MUST NOT/SHOULD/SHOULD NOT/MAY
```

### 3.4 应用册接入

1. `01`：工具名 + 链到 gate（不抄全文）。 
2. `commands`：`lint`（必有）、`fmt`（可选）；双语言用 `lint-ts` / `lint-py`；`check` 依赖之；字符串与 gate 逐字一致。 
3. `11`「代码风格」固定句：

```text
[ ] §0 三准则经由 meta/language-gates/<lang>.md 硬门闸落实 + commands lint 绿
```

### 3.5 kotlin / swift

语言层（null/错误/并发/fmt）进 gate；UI Lifecycle 留 android / apple 册。

---

## 4. 内容边界

### 必做

- 每条硬门闸：**归属 §0 之一** + 可探针 + **§0.2 规范关键词**（MUST / MUST NOT 等）。 
- 「算法精妙」类门闸：须能指出**哪条关键路径**、**期望复杂度或不变式**、**探针**；禁止空喊精妙。 
- fmt/lint 唯一；与 §0 冲突时改工具配置。 
- 冲突表须审视 Google Style（可整页不采用，因违极简/可测则写明）。

### 禁止

- 文风学徒制、缩进信仰、API 百科。 
- 无探针的「优雅」「地道」形容词门闸；无 RFC 关键词的「软建议」冒充硬门闸。 
- 为通过 Google 习惯法增加样板代码。 
- APM 必勾；语言百科册。

---

## 5. 齐套定义

1. [ ] §3.3 各节齐全（含**最高准则映射**表 + 文首 Normative 行） 
2. [ ] fmt+lint 无「或」开口 
3. [ ] 硬门闸 ∈[1,30]；每条有探针 + 归属 §0 + **§0.2 关键词** 
4. [ ] 映射表三行均有门闸 ID 或 `N/A`+理由（「算法精妙」在纯 CRUD 胶水层可 N/A） 
5. [ ] 冲突表含相对 §0 的 Google/官方裁决 ≥1 行 
6. [ ] 适用范围 ≥1 应用册 
7. [ ] 抽检：硬门闸表无「尽量 / 宜 / 最好 / 推荐 / prefer / ideally」且每条含规范关键词

顺序：齐套 → Focused B+E → 挂靠 → 字符串一致 → 应用册 Full → README=`PASS`。 
本文正式化：对本文件 Full 5/5（§8）。

---

## 6. 开闸顺序

typescript（react/nextjs）→ go → python → rust → kotlin → swift。

---

## 7. 证据策略

| 等级 | 用途 |
|------|------|
| **E0（本仓）** | §0 三准则；AGENTS 决策序 |
| P0 | 语言官方 + fmt/lint 文档 |
| P1 | Google Style 等（**可裁**） |
| P1w | 博客（默认不进硬门闸） |

裁决：**E0 > 可机械检查且不伤 §0 > 官方默认 > Google > 流行度**。

---

## 8. 对抗判定句

```text
仅凭本契约 + 齐套 gate + §3.4，能否落盘语言薄闸并挂靠，且：
硬门闸服从 §0（极简 > 清晰可测 > 算法精妙）；
硬门闸用 §0.2 MUST/MUST NOT（或 DO/DO NOT）可判定书写；
不新开百科册；不抢 Pass1/Pass2；lint/fmt 无双开口；齐套/重审可勾。
落盘路径不清=FAIL；缺某语言具体例句≠FAIL；硬门闸无规范关键词=FAIL。
```

| 角 | 深挖 |
|----|------|
| A | Lifecycle 1–7 + §9 |
| B | Lifecycle + 失败分类；§0 映射可执行；§0.2 关键词可判定 |
| C | 路径与 SSOT（含 §0 凌驾 Google） |
| D | `language-gates/` 树 |
| E | 齐套（含关键词抽检）、11 固定句、Focused vs Full |

---

## 9. 维护者清单（同 §2）

0. 本契约 Full 5/5 → 去「候选」→ 建 README。 
1–7. 按 §2 表执行；**仅步骤 7** 将 README 标 PASS。 
8. §10 元指南补丁。

---

## 10. 元指南补丁（契约 5/5 后）

1. §1.2「代码风格」证据：落实 **§0 三准则** via `language-gates/<lang>` + commands lint。 
2. 承认 `meta/language-gates/*.md`。 
3. roadmap：开闸序；不设语言百科 Wave。

---

## 11. 反面意见

- 「算法精妙」易被读成炫技 → 用 §0 表中写明「有探针的恰算法」。  
- 与 AGENTS「清晰 > 精巧」字面张力 → 本契约定义精妙⊂清晰可测下的正确算法，**精巧表演仍禁**。  

## 对抗

| 日期 | ROUND | SCORE | model |
|------|-------|-------|-------|
| 2026-07-11 | final | 5/5 | grok-4.5-fast-xhigh |
