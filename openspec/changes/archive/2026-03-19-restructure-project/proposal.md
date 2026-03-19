## Why

当前项目结构存在命名不一致、数据分散、语义不明等问题，影响项目维护效率。作为毕业设计项目，清晰的结构有助于后续答辩展示和代码提交。

## What Changes

- 统一目录命名为 kebab-case 风格
- 整合分散的数据文件到统一位置
- 重命名 `tex_relation` 为更清晰的 `thesis-workspace`
- 移动 `reference` 到论文工作区
- 清理残留文件（`.ruff_cache`、`nul`）
- 在根目录添加项目结构说明 README.md

## Capabilities

### New Capabilities

- `project-structure`: 定义项目的标准目录结构和命名规范

### Modified Capabilities

无（纯重构，不改变功能）

## Impact

- 目录重命名：`tex_relation` → `thesis-workspace`
- 目录移动：`reference` → `thesis-workspace/reference`
- 文件删除：`.ruff_cache/`、`nul`
- 新增：根目录 `README.md`