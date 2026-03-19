## ADDED Requirements

### Requirement: 系统可标准化指标数据

系统 SHALL 对原始指标数据进行 Min-Max 标准化处理。

#### Scenario: 正向指标标准化
- **WHEN** 指标为正向指标（越大越好）
- **THEN** 系统计算 x_normalized = (x - x_min) / (x_max - x_min)

#### Scenario: 负向指标标准化
- **WHEN** 指标为负向指标（越小越好，如受伤率）
- **THEN** 系统计算 x_normalized = (x_max - x) / (x_max - x_min)

---

### Requirement: 系统可处理缺失数据

系统 SHALL 对缺失的指标数据进行合理处理。

#### Scenario: 使用同类平均值
- **WHEN** 某项目缺少某指标数据
- **THEN** 系统使用同类型项目的平均值填充

#### Scenario: 标记缺失数据
- **WHEN** 使用填充值
- **THEN** 系统在界面标记该数据为估计值

---

### Requirement: 系统可检测异常值

系统 SHALL 检测并处理异常指标值。

#### Scenario: 异常值标记
- **WHEN** 指标值超出合理范围（如负数或超过 1）
- **THEN** 系统标记为异常值并提示用户确认

#### Scenario: 异常值修正
- **WHEN** 确认为数据错误
- **THEN** 系统使用边界值或平均值修正