# 系统架构

## 概述

奥运项目评估系统采用四层架构设计，基于 AHP-EWM 混合模型对奥运项目进行综合评估和预测。

## 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                      展示层 (React Components)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │ AHP面板  │ │ EWM面板  │ │ 项目评估 │ │ 预测推荐 │             │
│  │          │ │          │ │          │ │          │             │
│  │判断矩阵  │ │熵权计算  │ │雷达图    │ │概率图    │             │
│  │权重图    │ │对比图    │ │排名表    │ │建议      │             │
│  │一致性检验│ │数据表格  │ │对比分析  │ │灵敏度    │             │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
├─────────────────────────────────────────────────────────────────┤
│                      状态层 (Zustand Store)                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • alpha: number              (混合权重参数)                 │   │
│  │ • judgmentMatrix: number[][](判断矩阵)                   │   │
│  │ • projects: Project[]       (项目数据)                   │   │
│  │ • weights: { ahp, ewm, hybrid } (权重结果)              │   │
│  │ • selectedProjects: string[] (选中项目)                   │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                      计算层 (TypeScript)                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │ AHP计算  │ │ EWM计算  │ │ 权重混合 │ │ 项目评分 │             │
│  │          │ │          │ │          │ │          │             │
│  │特征值法  │ │数据标准化│ │α参数调整 │ │综合评分  │             │
│  │CR检验    │ │信息熵    │ │灵敏度分析│ │排名      │             │
│  │幂迭代法  │ │熵权      │ │          │ │预测概率  │             │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
├─────────────────────────────────────────────────────────────────┤
│                      数据层 (静态 JSON 文件)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │ config   │ │ ahp/     │ │ ewm/     │ │ projects/│             │
│  │ .json    │ │ *.json   │ │ *.json   │ │ *.json   │             │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

## 层次结构

### 展示层

负责用户界面渲染和交互响应。组件分为以下模块：

| 模块 | 组件 | 职责 |
|------|------|------|
| AHP | JudgmentMatrix, WeightsChart, ExpertComparison | 判断矩阵编辑、AHP权重可视化 |
| EWM | RawDataTable, EntropyValues, EWMCalculationViewer | 原始数据展示、熵权计算可视化 |
| 混合权重 | AlphaSlider, SensitivityChart | α参数调整、灵敏度分析 |
| 项目评估 | RadarChart, RankingTable, ScoreBreakdown | 雷达图、排名表、评分分解 |
| 预测推荐 | ProbabilityChart, PredictionSummary | 入选概率、预测摘要 |

### 状态层

使用 Zustand 进行状态管理，主要状态包括：

```typescript
interface AppState {
  alpha: number;                              // 混合权重参数 (0-1)
  judgmentMatrix: number[][];                  // AHP 判断矩阵
  projects: Project[];                         // 项目数据
  weights: {
    ahp: Record<string, number>;             // AHP 权重
    ewm: Record<string, number>;             // EWM 权重
    hybrid: Record<string, number>;          // 混合权重
  };
  selectedProjects: string[];                 // 选中的项目ID列表
  currentStep: number;                        // 当前步骤 (1-3)
}
```

### 计算层

核心算法实现位于 `src/lib/calculation.ts`：

| 函数 | 说明 |
|------|------|
| `powerIteration()` | 幂迭代法求矩阵特征值和特征向量 |
| `consistencyRatio()` | 计算一致性比率 CR |
| `geometricMean()` | 多专家判断矩阵几何平均 |
| `normalizeData()` | Min-Max 数据标准化 |
| `calculateEntropy()` | 信息熵计算 |
| `calculateEntropyWeights()` | 熵权计算 |
| `combineWeights()` | AHP-EWM 混合权重 |
| `rankProjects()` | 项目综合评分与排名 |
| `calculateProbability()` | 入选概率预测 |

### 数据层

静态 JSON 文件位于 `public/data/`：

| 目录 | 文件 | 说明 |
|------|------|------|
| / | config.json | 全局配置（维度定义、RI值、阈值） |
| ahp/ | judgment-matrix.json | 专家判断矩阵数据 |
| ahp/ | weights.json | AHP 权重计算结果 |
| ewm/ | weights.json | EWM 权重计算结果 |
| projects/ | core.json | 核心奥运项目 |
| projects/ | new.json | 新增项目（2020年后） |
| projects/ | candidate.json | 候选项目 |
| projects/ | removed.json | 已移除项目 |

## 数据流

```
用户操作 → Hooks加载数据 → Store更新状态 → 组件重渲染
                              ↓
                        计算层重新计算
                              ↓
                        权重/排名更新
```

1. **数据加载**：通过 `useConfig`、`useProjects`、`useJudgmentMatrix` 等 Hook 从 JSON 文件加载初始数据
2. **状态更新**：用户交互触发 Store 状态变更
3. **计算触发**：状态变更自动触发相关计算（如 α 变化时重新计算混合权重）
4. **界面更新**：计算结果通过 Zustand 传递给组件重新渲染

## 六维指标体系

| 指标 | ID | 说明 |
|------|-----|------|
| 流行度 | popularity | 项目在全球的普及程度和观众基础 |
| 性别平等 | gender_equity | 男女参赛比例和参与机会 |
| 可持续性 | sustainability | 场地需求、资源消耗、环境影响 |
| 包容性 | inclusivity | 对残障运动员、贫困地区参与度 |
| 创新性 | innovation | 技术创新、赛制创新程度 |
| 安全性 | safety | 运动损伤风险、医疗保障条件 |
