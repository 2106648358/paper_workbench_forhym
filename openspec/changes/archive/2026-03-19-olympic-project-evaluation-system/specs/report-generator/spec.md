## ADDED Requirements

### Requirement: 系统可导出排名数据

系统 SHALL 支持导出项目排名数据为 CSV 格式。

#### Scenario: 导出完整排名
- **WHEN** 用户点击"导出 CSV"按钮
- **THEN** 系统生成包含所有项目排名和评分的 CSV 文件并下载

#### Scenario: 导出筛选结果
- **WHEN** 用户筛选特定类型项目后点击导出
- **THEN** 系统仅导出当前筛选的项目

---

### Requirement: 系统可导出图表

系统 SHALL 支持导出可视化图表为图片格式。

#### Scenario: 导出雷达图
- **WHEN** 用户点击雷达图的"导出图片"按钮
- **THEN** 系统将当前雷达图导出为 PNG 格式图片

#### Scenario: 导出权重图
- **WHEN** 用户点击权重对比图的"导出图片"按钮
- **THEN** 系统将当前权重图导出为 PNG 格式图片

---

### Requirement: 系统可生成评估报告摘要

系统 SHALL 生成项目评估报告的文字摘要。

#### Scenario: 生成排名摘要
- **WHEN** 用户点击"生成报告"按钮
- **THEN** 系统生成包含排名前十项目、预测结果的文字摘要

#### Scenario: 复制报告内容
- **WHEN** 报告摘要生成
- **THEN** 用户可一键复制报告内容