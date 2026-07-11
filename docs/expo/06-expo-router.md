# 06 — Expo Router

## 不变量

- **主导航** = **Expo Router**（`app/` 文件路由）；禁平行自建导航容器当主路径。 
- 文件路径段名来自 Pass1 词表；深链 scheme/path 写在 INPUTS §7。 
- 导航是 **副作用**：由 Event / 用户手势触发 `router` API；**禁止**在 Repository 里导航。 
- 传参默认传 **id**；目标屏经 Screen State Lifecycle 拉数，禁默认塞大对象进 params。

## 步骤规格（实现自写）

1. **定义文件树** 
 - 起始 route = INPUTS。 
 - `_layout.tsx` 声明 Stack/Tabs；每个业务目的地 ↔ 一个文件。 

2. **动态段** 
 - `[id].tsx` 等；用 `useLocalSearchParams` 读参；缺必选参 → 不进 success（error 或回退）。 

3. **与 Lifecycle 协作** 
 - 进入焦点 → `05` 步骤 1；params 变化视为新 Enter（取消上一轮 inflight）。 

4. **鉴权门闸（若有）** 
 - 未认证 → 重定向登录（对齐 [docs/auth](../auth/README.md)）；回来后恢复原意图（若 INPUTS 要求）。 

5. **深层链接（若适用）** 
 - `scheme` + path；非法 URI → 安全落点；禁崩溃。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 缺必选 param | 不进入业务 success；error 或回退 |
| 未登录进受保护 route | 重定向登录；非假 success |
| 重复快速 push | 防抖 / 同 route 策略须写明；不堆无意义实例 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 冷启动 | 落到 INPUTS 起始 route |
| 带 id 打开详情 | model 收到 id；触发 load |
| 返回 | 上一 route；blur 取消已触发 |
| 深链合法 | 落到目标；非法不崩 |
