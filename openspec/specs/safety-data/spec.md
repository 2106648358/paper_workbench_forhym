## ADDED Requirements

### Requirement: 运动受伤率数据收集
系统 SHALL 从学术文献中收集各项目的运动受伤率数据。

#### Scenario: 文献检索
- **WHEN** 在 PubMed、Google Scholar 检索
- **THEN** 使用关键词 "[Sport Name] injury rate Olympic" 检索相关文献

#### Scenario: 提取受伤率数据
- **GIVEN** 相关学术文献
- **WHEN** 提取受伤率数据
- **THEN** 记录每1000小时/每1000次暴露的受伤事件数

#### Scenario: 数据缺失时的代理变量
- **WHEN** 某项目无受伤率文献
- **THEN** 使用对抗性程度评分作为代理变量 (1-5分)

### Requirement: 对抗性程度评估
系统 SHALL 评估项目的对抗性程度作为安全性的代理指标。

#### Scenario: 对抗性分类
- **WHEN** 分析项目特性
- **THEN** 分类为：高对抗(足球、篮球)、中对抗(网球)、低对抗(体操、射击)

### Requirement: 安全性评分计算
安全性评分 SHALL 按以下方式计算：
- 若有受伤率数据：E_safety = 1 - Norm(InjuryRate)
- 若使用代理变量：E_safety = 1 - Norm(AggressionScore/5)

### Requirement: 数据来源
安全性数据 SHALL 从以下来源获取：
- PubMed (pubmed.ncbi.nlm.nih.gov)
- Google Scholar
- IOC Medical Reports
- Br J Sports Med 等运动医学期刊