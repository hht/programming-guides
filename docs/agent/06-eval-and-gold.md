# 06 — 评测与金标（两栈同构）

## 不变量

- 金标：`evals/gold.jsonl`；每行符合 [templates/gold-case.schema.json](./templates/gold-case.schema.json)  
- 字段：`id`, `input`, `expected`（**整份返回信封**的断言子集）, `allowed_tools`, `max_turns`  
- `expected` **必须**含 `status`；若 `status=error` 必须含 `error_code`；若 `status=ok` 必须含 `output`（深等或 INPUTS 约定的匹配器）  
- 发版：`eval` 对金标全过  

## 步骤规格

1. INPUTS §8 → ≥3 条：至少 1×`ok`、1×`error`+`output_invalid` 或 `provider_*`（可用 mock）、1×`budget_exceeded`。  
2. `eval`：断言信封；`ok` 时按 INPUTS §5：默认深等；若勾自定义匹配则调用所写函数名。禁止对所有行要求 `status==ok`。  
3. `allowed_tools`：该 case **注册集必须等于**该行数组（可为空）；不得注册行外工具。全局 INPUTS §4 为产品全集；金标行 ⊆ 全集。  
4. 失败打印 `id` + diff；exit ≠0。  
5. live 烟测：默认 1 条；若 `N/A` 须在 INPUTS §8 写一行 `live_smoke: N/A — <理由>`。  

## 探针

| case | 期望 |
|------|------|
| 改坏 expected.status | eval 红 |
| budget 金标 | 断言 `error`+`budget_exceeded`，非假绿 |
