## ADDED Requirements

### Requirement: 全球参与人数数据收集
系统 SHALL 尝试从国际运动联合会(IFs)获取各项目的全球参与人数。

#### Scenario: 查找 IFs 官方统计
- **WHEN** 访问各运动项目的国际联合会官网
- **THEN** 查找年度统计报告中的全球参与人数

#### Scenario: 数据不可获取时的处理
- **WHEN** 某项目的 IFs 官网无参与人数统计
- **THEN** 标记该数据缺失，使用代理变量替代

### Requirement: Google Trends 热度数据
系统 SHALL 使用 Google Trends 作为流行度的代理指标。

#### Scenario: 提取搜索热度
- **WHEN** 查询项目名称的 Google Trends 数据
- **THEN** 获取过去12个月的平均搜索指数

#### Scenario: 标准化处理
- **GIVEN** 各项目的 Google Trends 指数
- **WHEN** 进行标准化处理
- **THEN** 指数归一化到 [0, 1] 区间

### Requirement: 数据来源
流行度数据 SHALL 从以下来源获取：
- 各 IFs 官网年度报告
- Google Trends (trends.google.com)
- Olympedia 项目历史数据