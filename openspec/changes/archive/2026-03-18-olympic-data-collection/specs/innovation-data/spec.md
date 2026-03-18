## ADDED Requirements

### Requirement: 加入奥运年份数据
系统 SHALL 从 Olympedia 获取每个项目的加入奥运年份。

#### Scenario: 查询项目历史
- **WHEN** 访问 Olympedia 项目页面
- **THEN** 可获取项目首次进入奥运会的年份

#### Scenario: 计算新近程度
- **GIVEN** 项目加入年份
- **WHEN** 计算距今年数
- **THEN** 新近程度 = 1 / (1 + 距今年数/50)

### Requirement: 青年奥运项目关联
系统 SHALL 查询项目是否为青年奥运会(YOG)项目。

#### Scenario: 获取 YOG 项目列表
- **WHEN** 访问 YOG 官网
- **THEN** 可获取青年奥运会的项目列表

#### Scenario: 标记年轻化程度
- **GIVEN** 项目是否在 YOG 存在
- **WHEN** 计算年轻化评分
- **THEN** 存在得 1 分，不存在得 0 分

### Requirement: 技术革新程度评估
系统 SHALL 通过文献或专家判断评估项目的技术革新程度。

#### Scenario: 文献评估
- **WHEN** 检索项目相关的技术发展文献
- **THEN** 根据文献数量和内容评估技术革新程度 (1-5分)

### Requirement: 数据来源
创新性数据 SHALL 从以下来源获取：
- Olympedia (olympedia.org)
- YOG 官网
- 学术文献检索