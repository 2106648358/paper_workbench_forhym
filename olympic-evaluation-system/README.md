# 奥运项目评估系统

基于 AHP-EWM 混合模型的奥运项目评估与预测可视化系统。

## 项目简介

本系统应用多准则决策分析方法（MCDM），对奥运项目的综合表现进行量化评估。系统采用 AHP（层次分析法）获取专家主观权重，结合 EWM（熵权法）计算客观权重，通过可调节的混合权重模型对奥运项目进行综合评分和 2032 年入选预测。

## 核心特性

- **AHP-EWM 混合权重模型**：结合主观专家判断与客观数据分布
- **六维指标评估体系**：流行度、性别平等、可持续性、包容性、创新性、安全性
- **交互式可视化仪表盘**：雷达图、排名表、权重分布图
- **实时参数调整**：α 参数滑块动态调整混合权重
- **2032 年预测**：基于综合评分的入选概率预测
- **What-If 模拟分析**：支持自定义参数模拟

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite |
| 状态管理 | Zustand |
| 可视化 | ECharts |
| 样式方案 | Tailwind CSS |

## 快速开始

### 环境要求

- Node.js >= 18.0.0

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:5173

# 构建生产版本
npm run build

# 运行测试
npm run test
```

## 文档导航

详细技术文档位于 `docs/` 目录：

| 文档 | 说明 |
|------|------|
| [docs/README.md](docs/README.md) | 文档目录总览 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 系统架构设计 |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | 开发指南 |
| [docs/API.md](docs/API.md) | 核心算法文档 |

## 相关资源

- [openspec 设计文档](../openspec/changes/archive/2026-03-19-olympic-project-evaluation-system/) - 方法论和设计决策完整记录
- [论文支撑数据](../openspec/changes/archive/2026-03-18-olympic-data-collection/) - 原始数据采集和指标体系

## 界面预览

系统包含三个主要步骤：

1. **权重确定**：使用 AHP、EWM 或混合方法计算指标权重
2. **项目评估**：查看奥运项目的综合评分和雷达图对比
3. **2032 预测**：预测未来奥运项目的入选概率
