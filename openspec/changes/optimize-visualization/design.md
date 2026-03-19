## Context

预测系统基于 React + TypeScript + ECharts 构建，现有组件结构：

```
src/components/
├── ahp/          # AHP 权重相关
├── ewm/          # EWM 权重相关
├── hybrid/       # 混合权重相关
├── prediction/   # 预测推荐相关
├── projects/     # 项目评估相关
└── common/       # 公共组件
```

当前问题：
- 判断矩阵为只读展示，无编辑功能
- EWM 计算过程一次性全部展示，信息过载
- 权重仅有柱状图，缺少饼图可视化
- 页面布局缺乏清晰的视觉层次

## Goals / Non-Goals

**Goals:**
- 实现判断矩阵可编辑输入
- EWM 计算过程交互式折叠展示
- 添加 3D 饼图权重可视化
- 优化页面语义和排版
- 修复项目展示不完整问题

**Non-Goals:**
- 不修改数据结构和计算逻辑
- 不添加新的评估指标
- 不重构现有组件架构

## Decisions

### 1. 判断矩阵输入实现

**方案**：使用 ContentEditable 或 Input 组件替换静态文本

**实现**：
- 上三角单元格使用 `<input type="number">` 组件
- 输入时实时计算并填充下三角倒数
- 添加编辑/只读模式切换

**文件**：`src/components/ahp/JudgmentMatrix.tsx`

### 2. EWM 折叠展示

**方案**：使用 Collapse 组件包装中间计算过程

**实现**：
- 默认折叠，仅展示最终权重结果
- 添加"查看计算过程"展开按钮
- 计算时显示 Skeleton 加载动画

**文件**：`src/components/ewm/` 相关组件

### 3. 饼图可视化

**方案**：使用 ECharts 饼图 + 3D 插件

**实现**：
- 使用 `echarts` 原生饼图（饼图/环形图）
- 3D 效果使用 `echarts-gl` 或 CSS 3D 变换模拟
- 支持鼠标交互（悬停高亮、点击选中）

**依赖**：`echarts`（已有），可选 `echarts-gl`

**文件**：新建 `src/components/common/PieChart.tsx`

### 4. 项目展示修复

**问题排查**：
- 检查 `prediction` 组件数据源
- 确认是否过滤条件导致部分项目隐藏

**实现**：
- 移除不当的筛选条件
- 确保展示全部 38 个项目

**文件**：`src/components/prediction/` 相关组件

## Risks / Trade-offs

- **风险**：3D 饼图性能可能影响低端设备
  - **缓解**：提供 2D/3D 切换选项，默认 2D
- **风险**：矩阵输入验证逻辑复杂
  - **缓解**：复用现有 AHP 计算函数的验证逻辑
- **风险**：折叠组件可能隐藏重要信息
  - **缓解**：保留关键指标摘要在折叠状态外