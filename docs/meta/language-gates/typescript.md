# TypeScript — Language Gate

> Normative: MUST / MUST NOT（RFC 2119；DO / DO NOT 同义，本文件统一用 MUST）

## 适用范围

- 应用册：[react](../../react/README.md)、[nextjs](../../nextjs/README.md)（及其他默认栈为 TypeScript 的挂靠册）
- **MUST NOT** 把 React hooks / RSC / Server Action 规则写入本闸（属应用册框架 MUST）

## 最高准则映射（必填）

| 准则 | 本语言如何落实（≤5 条硬门闸 ID） |
|------|----------------------------------|
| 极简 | G01, G02, G03 |
| 清晰可测 | G04, G05, G06, G08 |
| 算法精妙 | G07 |

## Formatter / Linter（仆人；互斥任选）

| 角色 | 工具 | 命令字符串 | 配置落点 |
|------|------|------------|----------|
| fmt | Prettier | `pnpm exec prettier --check .` | `.prettierrc` 或 `prettier` key in `package.json` |
| lint | ESLint flat + typescript-eslint | `pnpm exec eslint .` | `eslint.config.*`；**MUST** 含 `typescript-eslint` strictTypeChecked（或等价 strict + type-checked） |
| typecheck | `tsc` | `pnpm exec tsc -b --pretty false` | `tsconfig.json`：`strict` **MUST** 为 true |

**MUST NOT** 同时默认 Prettier 与 Biome。选 Biome 则本表三行命令须整表替换并更新全部挂靠 `commands.md` 逐字一致。

## 硬门闸（规约含规范关键词）

| ID | 归属准则 | 关键词 | 规约 | 探针 |
|----|----------|--------|------|------|
| G01 | 极简 | MUST NOT | 保留无引用的 export、类型、文件或依赖 | `eslint` unused / `tsc` 未使用；PR 无「保留理由」一行则 FAIL |
| G02 | 极简 | MUST NOT | 为通过 lint 而增加无调用方的 wrapper / Facade / 空 `index.ts` 再导出层 | 评审：删层后行为不变则必须删 |
| G03 | 极简 | MUST | `tsconfig` 启用 `strict`（含 strictNullChecks 等默认子集） | `tsc -b` exit 0；配置抽检 |
| G04 | 清晰可测 | MUST NOT | 在生产路径使用 `any` 或未经收窄的双重断言作为默认逃逸 | `@typescript-eslint/no-explicit-any` error（测试 fixture 可书面例外） |
| G05 | 清晰可测 | MUST | 可失败的边界（IO/解析）返回可判别结果（Result 等价、Zod parse、typed error），**MUST NOT** 以未文档化的 throw 字符串作为唯一信号 | 单测 case→期望；或 lint 禁 `throw new Error(unknown)` 无 code |
| G06 | 清晰可测 | MUST | 领域纯函数可单测；禁止假成功（吞错后返回成功形） | `09` case 表；失败路径断言 |
| G07 | 算法精妙 | SHOULD | 热路径（列表虚拟化、高频校验、路由 match）选用充分简单且有复杂度依据的实现；偏离须写明理由 | 关键路径注释或基准一句 + 探针 |
| G08 | 清晰可测 | MUST | 对 `JSON.parse` / 外部 JSON 先经 Zod（或等价）校验再当领域类型；**MUST NOT** 直接断言为业务类型 | 单测 / lint 抽检 |

## 命名边界

- Pass1/Pass2 → 应用册 `02`；本文件不写 camel/snake 对照表

## 证据与冲突

| 来源 | 采用? | why（相对 §0） |
|------|-------|----------------|
| TypeScript Handbook / `strict` | 是 | P0；可测与正确性 |
| typescript-eslint strictTypeChecked | 是 | 可机械检查且不伤极简 |
| Prettier | 是 | fmt 仆人；无业务语义 |
| Google TypeScript Style / gts | 部分 | 冲突表：不采用其「为风格增加样板」；不整书入库；命名表不抢 Pass1 |
| Airbnb JS Style | 否 | 过时且与 TS strict / 极简冲突面大 |

## 接入检查

- [ ] 01 已链接 [ ] commands 逐字一致 [ ] 11 = 固定句
- [ ] 每条硬门闸含 MUST/MUST NOT/SHOULD/SHOULD NOT/MAY
