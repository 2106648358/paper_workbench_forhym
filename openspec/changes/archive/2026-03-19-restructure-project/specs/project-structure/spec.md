## ADDED Requirements

### Requirement: 项目根目录结构规范

项目根目录 SHALL 遵循以下结构：

```
paper_workbench_hym/
├── olympic-evaluation-system/    # 预测系统
├── thesis-workspace/             # 论文工作区
│   ├── thesis/                   # LaTeX 论文
│   ├── data-collection/          # 数据收集
│   └── reference/                # 参考文献
├── openspec/                     # 变更管理
├── README.md                     # 项目说明
└── .gitignore
```

#### Scenario: 验证根目录结构
- **WHEN** 检查项目根目录
- **THEN** 存在 `olympic-evaluation-system/`、`thesis-workspace/`、`openspec/` 目录
- **AND** 不存在 `tex_relation/` 目录
- **AND** 根目录存在 `README.md` 文件

### Requirement: 目录命名风格

所有目录名 SHALL 使用 kebab-case（小写字母 + 连字符）格式。

#### Scenario: 验证目录命名
- **WHEN** 检查项目所有目录名
- **THEN** 所有目录名仅包含小写字母、数字和连字符
- **AND** 不包含下划线或空格

### Requirement: 论文工作区结构

`thesis-workspace/` 目录 SHALL 包含以下子目录：

```
thesis-workspace/
├── thesis/           # LaTeX 论文正文
├── data-collection/  # 数据收集工作
└── reference/        # 参考文献 PDF
```

#### Scenario: 验证论文工作区结构
- **WHEN** 检查 `thesis-workspace/` 目录
- **THEN** 存在 `thesis/`、`data-collection/` 子目录
- **AND** 存在 `reference/` 子目录

### Requirement: 无残留文件

项目根目录 SHALL NOT 包含以下残留文件：
- `.ruff_cache/` 目录
- `nul` 文件

#### Scenario: 验证无残留文件
- **WHEN** 检查项目根目录
- **THEN** 不存在 `.ruff_cache/` 目录
- **AND** 不存在 `nul` 文件