# 07 — 配置变更与 SavedState

## 不变量

- **配置变更**（旋转、深色模式、字体缩放、多窗口等）不得丢失用户已达的业务 UiState：**默认靠 ViewModel 在 Activity/Fragment 作用域内存活**。  
- 仅内存不够时（进程死亡、须跨重建的输入草稿/页码/选中 id）：用 **SavedStateHandle** 键或 INPUTS 声明的 DataStore/磁盘策略。  
- 每个屏的策略在 INPUTS §8 勾选；禁止「假设永不旋转」。  
- 超越：相对标杆「常见 demo 只谈 ViewModel、弱化进程死亡」→ 本指南要求 **显式恢复策略表**（见 `11` a2）。

## 步骤规格（实现自写）

1. **分类状态**  
   | 种类 | 例子 | 默认策略 |
   |------|------|----------|
   | 可重新派生 | 列表远程数据 | ViewModel 存活则保留；进程死后按 Enter 再拉 |
   | 用户输入草稿 | 搜索框、表单字段 | SavedStateHandle 或显式保存 |
   | 导航身份 | 详情 `orderId` | nav args + SavedStateHandle |
   | 长期偏好 | 主题、token | DataStore / 加密存储（非 UiState） |

2. **ViewModel + SavedStateHandle**  
   - 构造注入 `SavedStateHandle`。  
   - 键名：**词表 snake 或稳定字符串**；写入 INPUTS §8 列表。  
   - 恢复顺序：读 Handle → 填充 UiState 初始 → 再决定是否 `Refresh`。  

3. **进程死亡**  
   - 仪器测试或文档化手动步骤：杀进程后恢复；断言导航参数与草稿键仍在。  
   - 远程列表：允许重新 `loading`→success；**不可**丢失「用户正在看的实体 id」。  

4. **禁止**  
   - 把整份大型 UiState 无差别塞进 SavedState（超 Bundle 限额）；只存 **恢复所需最小键**。  
   - 用静态/`object` 单例缓存业务 UiState 冒充恢复（测试脆弱、泄漏）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| Handle 缺键 | 走冷启动路径；不崩 |
| 恢复后 id 对应 NOT_FOUND | `not-found` 帧 |
| INPUTS §8 未填 | `INPUTS BLOCKED` |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 旋转（或 ViewModel 作用域保留） | 同 UiState 内容保留；非强制全屏闪回 loading（除非重新 Enter） |
| SavedState 键写入后重建 | 读回键值；草稿不丢 |
| 仅存 id | 重建后仍加载同一详情 |
| 超大对象塞 Bundle | **禁止**；设计评审拒绝 |
