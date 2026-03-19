## ADDED Requirements

### Requirement: 权重饼图展示

系统 SHALL 为权重分布提供饼图可视化展示。

#### Scenario: 显示权重饼图
- **WHEN** 用户查看 AHP 权重、EWM 权重或混合权重
- **THEN** 系统显示各指标权重的饼图
- **AND** 饼图各扇区显示指标名称和权重百分比

#### Scenario: 饼图交互
- **WHEN** 用户悬停在饼图扇区上
- **THEN** 高亮显示该扇区
- **AND** 显示详细的权重数值

### Requirement: 3D 饼图效果

系统 SHALL 支持 3D 饼图展示效果。

#### Scenario: 切换 3D 效果
- **WHEN** 用户点击"3D 效果"切换按钮
- **THEN** 饼图从 2D 平面效果切换为 3D 立体效果
- **AND** 用户可旋转查看 3D 饼图

#### Scenario: 单一权重场景
- **WHEN** 某个指标权重接近或等于 1（其他权重接近 0）
- **THEN** 饼图仍然正确显示各扇区比例
- **AND** 提示用户权重分布极度不均