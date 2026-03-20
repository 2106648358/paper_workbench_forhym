## ADDED Requirements

### Requirement: 通过 Zotero MCP 检索学术文献
系统 SHALL 支持通过 Zotero MCP 工具检索 AHP、EWM、多准则决策、奥运评估相关的学术文献。

#### Scenario: 检索 AHP 核心文献
- **WHEN** 使用 Zotero MCP 搜索关键词 "analytic hierarchy process" 或 "AHP"
- **THEN** 返回 Saaty 等学者的核心论文列表

#### Scenario: 检索混合模型文献
- **WHEN** 使用 Zotero MCP 搜索关键词 "hybrid AHP EWM" 或 "combined weight"
- **THEN** 返回混合权重模型相关研究文献

### Requirement: 提取文献核心方法论
从阅读的文献中 SHALL 提取核心方法论、关键公式、重要结论，形成文献笔记。

#### Scenario: 提取 AHP 方法论要点
- **WHEN** 阅读 Saaty 的 AHP 经典论文
- **THEN** 提取判断矩阵构建方法、一致性检验公式、权重求解原理

### Requirement: 导出 BibTeX 格式参考文献
系统 SHALL 将收集的文献导出为 BibTeX 格式，便于 LaTeX 论文引用。

#### Scenario: 导出文献库
- **WHEN** 完成文献收集和整理
- **THEN** 导出 references.bib 文件，格式符合 GB/T 7714-2005

### Requirement: 建立文献与论文章节的关联
每篇重要文献 SHALL 与论文章节建立关联，明确引用位置。

#### Scenario: 文献引用规划
- **WHEN** 规划论文章节内容
- **THEN** 明确每篇文献在哪个章节被引用，用于支撑什么论点