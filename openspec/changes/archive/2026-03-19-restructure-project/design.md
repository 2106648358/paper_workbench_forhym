## Context

毕业设计项目包含两个主要工作区：
- **预测系统** (`olympic-evaluation-system/`)：React + TypeScript 前端应用
- **论文工作区** (`tex_relation/`)：LaTeX 论文 + 数据收集

当前问题：
- 命名风格混用（`olympic-evaluation-system` vs `tex_relation`）
- 数据分散在多处
- `tex_relation` 命名语义不清
- 残留无用文件

## Goals / Non-Goals

**Goals:**
- 统一目录命名为 kebab-case
- 整合数据文件位置
- 清晰的模块边界
- 添加项目结构说明文档

**Non-Goals:**
- 不修改任何代码或内容
- 不改变 Git 历史
- 不调整 openspec 目录结构

## Decisions

### 1. 目录命名风格：kebab-case

**理由**：与现有 `olympic-evaluation-system` 保持一致，符合 JavaScript/Web 项目惯例。

**变更**：`tex_relation` → `thesis-workspace`

### 2. reference 目录位置

**决定**：移动到 `thesis-workspace/reference/`

**理由**：参考文献主要服务于论文撰写，应归属于论文工作区。

### 3. 数据文件位置

**决定**：保持现状，不移动数据文件

**理由**：
- `olympic-evaluation-system/public/data/` 是系统运行时数据
- `thesis-workspace/data_collection/data/` 是原始收集数据
- `thesis-workspace/thesis/data/` 是论文专用数据
- 三者用途不同，分离更清晰

### 4. README.md 内容

**决定**：在根目录添加简洁的项目结构说明

## Risks / Trade-offs

- **风险**：重命名可能影响 IDE 中的打开文件路径
  - **缓解**：操作前关闭所有编辑器
- **风险**：Git 历史追踪可能变得复杂
  - **缓解**：使用 `git mv` 保留文件历史