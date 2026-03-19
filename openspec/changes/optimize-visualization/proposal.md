## Why

预测系统现有可视化存在以下问题：
- AHP 判断矩阵无法直接输入数值，用户体验不佳
- EWM 页面中间过程过于冗长，缺乏交互性
- 混合权重页缺少饼图展示，交互体验需优化
- 项目评估页语义不清、排版需改进
- 预测推荐页展示不完整（38 项目仅显示 28 个），功能定位模糊

## What Changes

### AHP 权重页
- 支持上三角矩阵直接输入数值（下三角自动填充倒数）

### EWM 权重页
- 隐藏详细中间计算过程，改为折叠/展开交互
- 计算过程设计为加载动画，提升用户体验

### 混合权重页
- 添加权重饼图展示（支持 3D 效果）
- 优化 α 参数滑块交互体验

### 项目评估页
- 优化页面语义和排版设计
- 改进雷达图、排名表格展示

### 预测推荐页
- 核查项目展示完整性（应显示全部 38 个项目）
- 评估是否保留该标签页，或合并到项目评估页

## Capabilities

### New Capabilities

- `ahp-matrix-input`: AHP 判断矩阵数值输入功能
- `ewm-interactive-display`: EWM 计算过程交互式展示
- `pie-chart-visualization`: 权重饼图可视化（含 3D 效果）

### Modified Capabilities

- `visualization-dashboard`: 优化各页面布局和交互
- `prediction-engine`: 修复项目展示不完整问题

## Impact

- 影响组件：`src/components/` 下 AHP、EWM、混合权重、项目评估相关组件
- 新增依赖：ECharts 饼图/3D 图表配置
- 数据层：无变更