## ADDED Requirements

### Requirement: BibTeX 文献库建立
系统 SHALL 建立 BibTeX 格式的参考文献库，包含至少 20 篇相关文献。

#### Scenario: 文献库完整性
- **WHEN** 检查 references.bib 文件
- **THEN** 文献数量不少于 20 篇，格式正确

### Requirement: 引用格式规范
参考文献 SHALL 符合 GB/T 7714-2005 规范，使用 gbt7714 宏包。

#### Scenario: 引用格式检查
- **WHEN** 编译论文后检查参考文献
- **THEN** 格式符合国标要求，作者、年份、期刊等信息完整

### Requirement: 正文引用标记
论文正文 SHALL 使用 \cite 命令正确引用参考文献，引用处标注正确。

#### Scenario: 引用标记验证
- **WHEN** 检查正文引用
- **THEN** 每个引用标记对应正确的参考文献条目

### Requirement: 参考文献分类
参考文献 SHALL 包含中文文献和外文文献，比例合理。

#### Scenario: 文献语言分布
- **WHEN** 统计参考文献
- **THEN** 中英文文献比例适当，涵盖关键研究领域

### Requirement: 核心文献覆盖
参考文献 SHALL 包含 AHP 和 EWM 的经典文献，包括 Saaty、Zeleny 等开创性工作。

#### Scenario: 经典文献检查
- **WHEN** 审查参考文献列表
- **THEN** 包含 Saaty (AHP) 和熵权法相关的核心文献