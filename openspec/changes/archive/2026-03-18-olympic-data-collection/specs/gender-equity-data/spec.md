## ADDED Requirements

### Requirement: 男女参赛比例数据收集
系统 SHALL 从 IOC 官方报告收集各项目的男女参赛比例数据。

#### Scenario: 提取男女运动员数量
- **WHEN** 访问 IOC Olympics 官网
- **THEN** 可从每届奥运会的官方报告中提取各项目男女运动员数量

#### Scenario: 计算性别均衡度
- **GIVEN** 男女运动员数量数据
- **WHEN** 计算性别均衡度
- **THEN** 均衡度 = 1 - |P_male - 0.5| × 2

### Requirement: 混合项目统计
系统 SHALL 统计每个奥运项目的混合项目数量占比。

#### Scenario: 识别混合项目
- **WHEN** 分析项目赛事设置
- **THEN** 可识别出男女混合参赛的子项目

#### Scenario: 计算混合项目比例
- **GIVEN** 项目总赛事数和混合赛事数
- **WHEN** 计算比例
- **THEN** 混合项目比例 = N_mixed / N_total

### Requirement: 数据来源
性别平等数据 SHALL 从以下来源获取：
- IOC Official Reports (olympics.com)
- Olympedia (olympedia.org)