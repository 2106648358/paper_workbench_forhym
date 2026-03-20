## ADDED Requirements

### Requirement: 实现 AHP 权重计算功能
计算支持工具 SHALL 实现 AHP 层次分析法权重计算功能，包括判断矩阵输入、权重求解、一致性检验。

#### Scenario: AHP 权重计算
- **WHEN** 输入有效的判断矩阵
- **THEN** 输出权重向量、最大特征值、CR 值，并判断一致性是否通过

### Requirement: 实现 EWM 熵权计算功能
计算支持工具 SHALL 实现熵权法权重计算功能，包括数据标准化、信息熵计算、熵权求解。

#### Scenario: EWM 熵权计算
- **WHEN** 输入决策矩阵数据
- **THEN** 输出各指标的熵值和权重值

### Requirement: 实现混合权重组合功能
计算支持工具 SHALL 实现 AHP-EWM 混合权重组合计算功能。

#### Scenario: 混合权重计算
- **WHEN** 输入 AHP 权重和 EWM 权重及组合系数 α
- **THEN** 输出混合权重向量

### Requirement: 实现综合评分计算功能
计算支持工具 SHALL 实现基于混合权重的项目综合评分计算功能。

#### Scenario: 综合评分计算
- **WHEN** 输入权重向量和决策矩阵
- **THEN** 输出各项目的综合评分和排名

### Requirement: 生成基础图表
计算支持工具 SHALL 生成论文所需的基础图表，包括权重分布图、雷达图。

#### Scenario: 权重分布图生成
- **WHEN** 完成权重计算
- **THEN** 输出权重对比柱状图，格式为 PDF

### Requirement: 输出结果可引用格式
计算支持工具 SHALL 将计算结果输出为可直接用于论文的格式。

#### Scenario: LaTeX 表格输出
- **WHEN** 完成计算后
- **THEN** 输出可直接复制到 LaTeX 的表格代码