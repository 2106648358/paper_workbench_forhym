# 文档目录

本文档体系面向技术评审/开发团队，介绍奥运项目评估系统的技术实现细节。

## 文档列表

| 文档 | 路径 | 说明 |
|------|------|------|
| 架构文档 | [ARCHITECTURE.md](./ARCHITECTURE.md) | 系统架构、层次结构、数据流设计 |
| 开发指南 | [DEVELOPMENT.md](./DEVELOPMENT.md) | 环境配置、项目结构、组件规范、测试 |
| 算法文档 | [API.md](./API.md) | AHP/EWM 算法、混合权重、评分预测 |

## 快速导航

### 了解项目
1. 阅读 [ARCHITECTURE.md](./ARCHITECTURE.md) 了解系统整体架构
2. 阅读 [API.md](./API.md) 了解核心算法实现

### 开始开发
1. 确保 Node.js >= 18
2. 运行 `npm install` 安装依赖
3. 运行 `npm run dev` 启动开发服务器
4. 详情见 [DEVELOPMENT.md](./DEVELOPMENT.md)

### 相关资源
- [openspec 设计文档](../../openspec/changes/archive/2026-03-19-olympic-project-evaluation-system/) - 方法论和设计决策完整记录
- [论文支撑数据](../../openspec/changes/archive/2026-03-18-olympic-data-collection/) - 原始数据采集和指标体系
