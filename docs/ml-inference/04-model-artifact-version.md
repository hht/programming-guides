# 04 — 模型 Artifact 版本钉死

## 不变量

- 生产推理进程绑定 **显式** `model_id` + `artifact_version`。  
- **`latest` 禁止**作为生产唯一解析目标（可在开发文档出现，但启动配置必须解析到具体 semver 或 digest）。  
- 加载前校验 manifest / digest；失败 → **进程不接流量**（启动非 0）或就绪探针失败。  
- 请求若携带 `model_id` / `artifact_version`，必须与已加载集合匹配；否则 `inference.model_mismatch`，**禁止**静默 fallback。

## Artifact 身份

| 字段 | 规则 |
|------|------|
| `model_id` | 业务名（Pass1）；稳定，不随权重文件名变 |
| `artifact_version` | **全文一种**：`X.Y.Z` **或** `sha256:<hex>` |
| `manifest` | 至少：`framework`、`input_names`/`shape` 约束、`digest`、`created_at` |

目录例：

```text
artifacts/<model_id>/<artifact_version>/
  model.onnx          # 或 runtime 约定文件名
  MANIFEST.json
```

对象存储 URI 等价：不可变对象键含 version/digest；覆盖写同键 **禁止**（或启用对象版本且应用钉死 version id）。

## 启动加载步骤

1. 读环境/配置：`MODEL_ID`、`ARTIFACT_VERSION`（及 URI/路径）。  
2. 取 artifact 字节或本地文件；计算或核对 sha256。  
3. 与 `MANIFEST.json` / INPUTS 声明一致 → `InferenceRuntime.load(...)`。  
4. 缓存「已加载集合」`{(model_id, artifact_version)}` 供步骤 authorize/validate 使用。  
5. 多模型（INPUTS §16）：对每个条目重复 1–4；**禁止**半加载仍报就绪。

## 滚动发布

| 策略 | 说明 |
|------|------|
| 蓝绿 / 新实例 | 新 `ARTIFACT_VERSION` 的新进程；流量切完再下线旧版 |
| 同进程热换 | **默认不做**；若做须 INPUTS 书面 + 并发安全 + 旧请求仍回旧 `artifact_version` |

## 失败分类

| 情况 | 行为 |
|------|------|
| digest 不匹配 | 启动失败 / 就绪失败 |
| 未知 framework | 启动失败 |
| 请求 version ≠ 已加载 | `inference.model_mismatch`（4xx） |
| artifact 存储不可达 | `inference.unavailable`（启动或运行时按阶段） |

## 单测探针

| case | 期望 |
|------|------|
| 配置 `latest` 且无冻结映射 | 启动/check-inputs 失败 |
| digest 被篡改 | load 失败 |
| 请求错误 version | `model_mismatch`；runtime.infer 调用次数 = 0 |
| 成功响应 | `artifact_version` == 已加载版本 |
