## ADDED Requirements

### Requirement: 残奥关联数据收集
系统 SHALL 从 IPC 官网获取项目是否在残奥会存在的信息。

#### Scenario: 获取残奥项目列表
- **WHEN** 访问 IPC 官网
- **THEN** 可获取完整的残奥会项目列表

#### Scenario: 标记残奥关联
- **GIVEN** 奥运项目列表和残奥项目列表
- **WHEN** 对比两个列表
- **THEN** 标记每个奥运项目的残奥关联状态 (1=存在, 0=不存在)

### Requirement: 发展中国家参与度数据
系统 SHALL 从奥运参赛统计数据计算发展中国家参与度。

#### Scenario: 获取参赛国列表
- **WHEN** 访问 Olympedia 或 IOC 报告
- **THEN** 可获取每个项目的参赛国和运动员数量

#### Scenario: 计算发展中国家参与度
- **GIVEN** 参赛国列表和联合国发展中国家定义
- **WHEN** 计算发展中国家运动员占比
- **THEN** 发展中国家参与度 = 发展中国家运动员数 / 总运动员数

### Requirement: 数据来源
包容性数据 SHALL 从以下来源获取：
- IPC 官网 (paralympic.org)
- Olympedia (olympedia.org)
- 联合国发展中国家名单