## ADDED Requirements

### Requirement: 系统定义六维指标体系

系统 SHALL 定义并维护六维奥运项目评估指标体系。

#### Scenario: 加载指标定义
- **WHEN** 系统初始化
- **THEN** 系统从 config.json 加载六维指标定义（流行度、性别平等、可持续性、包容性、创新性、安全性）

#### Scenario: 指标维度展示
- **WHEN** 用户查看指标体系
- **THEN** 系统展示各指标的名称、英文名和量化公式说明

---

### Requirement: 系统可量化流行度指标

系统 SHALL 量化各项目的流行度指标。

#### Scenario: 流行度评分计算
- **WHEN** 项目有参与人数和收视率数据
- **THEN** 系统计算流行度评分 E_pop = normalized(global_participation) × 0.5 + normalized(viewership) × 0.5

---

### Requirement: 系统可量化性别平等指标

系统 SHALL 量化各项目的性别平等指标。

#### Scenario: 性别平等评分计算
- **WHEN** 项目有男女参赛比例数据
- **THEN** 系统计算性别平等评分 E_gender = 1 - |male_ratio - 0.5| × 2

#### Scenario: 混合项目加分
- **WHEN** 项目包含混合项目
- **THEN** 系统根据混合项目数量调整性别平等评分

---

### Requirement: 系统可量化可持续性指标

系统 SHALL 量化各项目的可持续性指标。

#### Scenario: 可持续性代理评分
- **WHEN** 项目有场馆和设备需求数据
- **THEN** 系统计算可持续性评分 E_sust = 1 - (venue_complexity + equipment_dependency) / 10

---

### Requirement: 系统可量化包容性指标

系统 SHALL 量化各项目的包容性指标。

#### Scenario: 残奥关联度计算
- **WHEN** 项目在残奥会中存在对应项目
- **THEN** 系统给予残奥关联度加分

#### Scenario: 发展中国家参与度
- **WHEN** 项目有参赛国分布数据
- **THEN** 系统根据发展中国家参与比例计算包容性评分

---

### Requirement: 系统可量化创新性指标

系统 SHALL 量化各项目的创新性指标。

#### Scenario: 新项目创新评分
- **WHEN** 项目为近届新增（2020年后）
- **THEN** 系统给予较高的创新性评分

#### Scenario: 青年化程度
- **WHEN** 项目有青年参与者比例数据
- **THEN** 系统根据青年参与度调整创新性评分

---

### Requirement: 系统可量化安全性指标

系统 SHALL 量化各项目的安全性指标。

#### Scenario: 受伤率反向评分
- **WHEN** 项目有受伤率数据
- **THEN** 系统计算安全性评分 E_safety = 1 - normalized(injury_rate)

#### Scenario: 无数据项目处理
- **WHEN** 项目缺乏受伤率数据
- **THEN** 系统使用同类项目平均值或标记为缺失