## Context

本项目旨在构建一个基于 AHP-EWM 混合模型的奥运项目评估与预测系统，同时完成毕业论文的系统设计与实现章节。系统需要实现混合权重计算、提供可视化展示、支持交互式参数调整，并生成论文所需的图表。

**约束条件**：
- 时间约束：需在论文截止日期前完成全部工作
- 技术约束：纯前端项目，Node.js 环境，React 或 Vue 框架
- 数据约束：静态 JSON 数据文件，无需后端 API
- 部署约束：可部署到 GitHub Pages 或 Vercel，也可本地运行

**相关方**：论文指导教师、答辩委员会、潜在的系统用户（IOC 决策者模拟）

## Goals / Non-Goals

**Goals:**
- 实现完整的 AHP-EWM 混合权重计算流程（前端 JavaScript 实现）
- 构建六维指标评价体系并进行可视化展示
- 开发交互式 Web 可视化仪表盘，支持参数调整
- 展示项目评分、排名、权重对比、预测推荐结果
- AHP 和 EWM 计算过程可视化，让模型"透明化"
- 完成论文系统设计与实现章节

**Non-Goals:**
- 不部署到生产环境（仅作为演示和研究用途）
- 不集成实时数据 API（使用静态 JSON 数据集）
- 不开发移动端应用
- 不涉及 IOC 内部决策流程集成
- 不需要后端服务

## Decisions

### 1. 技术栈选择

| 层次 | 技术选型 | 理由 |
|------|----------|------|
| 前端框架 | React 18+ / Vue 3+ | 生态成熟，组件化开发，TypeScript 支持 |
| 构建工具 | Vite | 快速开发体验，热更新，原生 ESM |
| 状态管理 | Zustand (React) / Pinia (Vue) | 轻量级，易于使用 |
| 可视化 | ECharts | 功能强大，雷达图/柱状图/散点图效果优秀 |
| 数据表格 | react-table (React) / vxe-table (Vue) | 支持排序、筛选、分页 |
| 数学计算 | 自研 + math.js | AHP/EWM 核心算法自研，复杂运算用 math.js |
| 样式方案 | Tailwind CSS | 快速开发，响应式设计 |
| 语言 | TypeScript | 类型安全，开发体验好 |
| 部署 | GitHub Pages / Vercel | 免费，自动部署 |

**推荐方案**：React + TypeScript + Vite + ECharts + Zustand + Tailwind CSS

### 2. 系统架构（纯前端）

```
┌─────────────────────────────────────────────────────────────────┐
│                    展示层 (React/Vue Components)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ AHP面板  │ │ EWM面板  │ │ 项目评估 │ │ 预测推荐 │           │
│  │          │ │          │ │          │ │          │           │
│  │判断矩阵  │ │熵权计算  │ │雷达图    │ │概率图    │           │
│  │权重图    │ │对比图    │ │排名表    │ │建议      │           │
│  │一致性检验│ │数据表格  │ │对比分析  │ │灵敏度    │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
├─────────────────────────────────────────────────────────────────┤
│                    状态层 (Zustand/Pinia)                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • currentAlpha: number          (α 参数)                │   │
│  │ • judgmentMatrix: number[][]    (判断矩阵)              │   │
│  │ • projects: Project[]           (项目数据)              │   │
│  │ • weights: { ahp, ewm, hybrid } (权重结果)              │   │
│  │ • selectedProjects: string[]    (选中项目)              │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                    计算层 (TypeScript/JavaScript)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ AHP计算  │ │ EWM计算  │ │ 权重混合 │ │ 项目评分 │           │
│  │          │ │          │ │          │ │          │           │
│  │特征值法  │ │数据标准化│ │α参数调整 │ │综合评分  │           │
│  │CR检验    │ │信息熵    │ │灵敏度分析│ │排名      │           │
│  │幂迭代法  │ │熵权      │ │          │ │预测概率  │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
├─────────────────────────────────────────────────────────────────┤
│                    数据层 (静态 JSON 文件)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ config   │ │ ahp/     │ │ ewm/     │ │ projects/│           │
│  │ .json    │ │ *.json   │ │ *.json   │ │ *.json   │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### 3. 数据文件结构

```
public/data/
├── config.json                 # 全局配置
│   ├── version                 # 版本号
│   ├── defaultAlpha            # 默认 α 值 (0.5)
│   ├── dimensions[]            # 六维指标定义
│   ├── riValues                # 随机一致性指标 RI 值
│   └── thresholds              # 入选/淘汰阈值
│
├── ahp/
│   ├── judgment-matrix.json    # 判断矩阵（专家数据）
│   │   ├── experts[]           # 专家信息
│   │   ├── matrices            # 各专家判断矩阵
│   │   └── aggregated          # 整合后矩阵
│   └── weights.json            # AHP 权重计算结果
│       ├── weights             # 权重向量
│       └── consistency         # 一致性检验结果
│
├── ewm/
│   ├── raw-indicators.json     # 原始指标数据
│   ├── normalized.json         # 标准化后数据
│   └── weights.json            # EWM 权重结果
│
├── projects/
│   ├── core.json               # 核心项目（田径、游泳等）
│   ├── new.json                # 新增项目（攀岩、滑板等）
│   ├── candidate.json          # 候选项目（电竞等）
│   └── removed.json            # 已移除项目（空手道等）
│
└── results/
    ├── rankings.json           # 最终排名结果
    └── predictions.json        # 2032 预测结果
```

### 4. 可视化模块设计

#### 4.1 AHP 可视化面板

| 组件 | 功能 | 交互 |
|------|------|------|
| JudgmentMatrixEditor | 判断矩阵展示与编辑 | 支持修改判断值，实时计算 |
| ConsistencyCheck | 一致性检验结果展示 | 显示 CR 值，通过/警告状态 |
| AHPWeightsChart | AHP 权重柱状图 | 鼠标悬停显示数值 |
| ExpertComparison | 多专家权重对比 | 可选择查看单个专家或整合结果 |

#### 4.2 EWM 可视化面板

| 组件 | 功能 | 交互 |
|------|------|------|
| RawDataTable | 原始指标数据表格 | 可排序、筛选 |
| NormalizedTable | 标准化数据展示 | 切换原始/标准化视图 |
| EntropyValues | 信息熵值展示 | 显示各指标熵值和效用值 |
| EWMWeightsChart | EWM 权重柱状图 | 与 AHP 权重并列对比 |

#### 4.3 混合权重面板

| 组件 | 功能 | 交互 |
|------|------|------|
| AlphaSlider | α 参数滑块 | 拖动调整 α，实时更新权重 |
| WeightsComparison | 三种权重对比图 | AHP/EWM/Hybrid 并列展示 |
| SensitivityChart | 灵敏度分析图 | 排名稳定性 vs α 曲线 |

#### 4.4 项目评估面板

| 组件 | 功能 | 交互 |
|------|------|------|
| ProjectSelector | 项目选择器 | 多选/全选，按类型筛选 |
| RadarChart | 六维雷达图 | 多项目叠加对比 |
| RankingTable | 综合排名表格 | 排序、分页、导出 CSV |
| ScoreBreakdown | 评分分解图 | 展示各维度贡献 |

#### 4.5 预测推荐面板

| 组件 | 功能 | 交互 |
|------|------|------|
| ProbabilityChart | 入选概率图 | 横向柱状图，高/中/低概率分色 |
| PredictionSummary | 预测摘要 | 高概率入选/淘汰项目列表 |
| RecommendationCard | 改进建议卡片 | 选中项目后显示改进建议 |

### 5. 核心计算算法（JavaScript 实现）

#### 5.1 AHP 权重计算

```typescript
// 使用幂迭代法求主特征值和特征向量
function powerIteration(matrix: number[][], maxIter = 100): { eigenvalue: number, eigenvector: number[] }

// 计算一致性比率
function consistencyRatio(matrix: number[][], lambdaMax: number): { CI: number, CR: number, passed: boolean }

// 多专家矩阵几何平均
function geometricMean(matrices: number[][][]): number[][]
```

#### 5.2 EWM 权重计算

```typescript
// Min-Max 标准化
function normalize(data: number[][], direction: ('positive' | 'negative')[]): number[][]

// 计算信息熵
function entropy(normalizedData: number[][]): number[]

// 计算熵权
function entropyWeight(entropyValues: number[]): number[]
```

#### 5.3 项目评分

```typescript
// 综合评分计算
function projectScore(indicators: Record<string, number>, weights: Record<string, number>): number

// 项目排名
function rankProjects(projects: Project[], weights: Record<string, number>): RankedProject[]

// 入选概率预测
function predictProbability(score: number, historicalData: HistoricalData): number
```

### 6. 项目目录结构

```
olympic-evaluation-system/
├── public/
│   └── data/                    # 静态 JSON 数据
│       ├── config.json
│       ├── ahp/
│       ├── ewm/
│       ├── projects/
│       └── results/
│
├── src/
│   ├── components/              # UI 组件
│   │   ├── ahp/
│   │   │   ├── JudgmentMatrix.tsx
│   │   │   ├── WeightsChart.tsx
│   │   │   └── ConsistencyCheck.tsx
│   │   ├── ewm/
│   │   │   ├── EntropyTable.tsx
│   │   │   └── WeightsChart.tsx
│   │   ├── hybrid/
│   │   │   ├── AlphaSlider.tsx
│   │   │   ├── WeightsComparison.tsx
│   │   │   └── SensitivityChart.tsx
│   │   ├── projects/
│   │   │   ├── ProjectSelector.tsx
│   │   │   ├── RadarChart.tsx
│   │   │   ├── RankingTable.tsx
│   │   │   └── ProjectCompare.tsx
│   │   ├── prediction/
│   │   │   ├── ProbabilityChart.tsx
│   │   │   └── Recommendations.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Layout.tsx
│   │
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useAHP.ts
│   │   ├── useEWM.ts
│   │   ├── useHybrid.ts
│   │   └── useProjects.ts
│   │
│   ├── lib/                     # 计算逻辑
│   │   ├── ahp.ts
│   │   ├── ewm.ts
│   │   ├── hybrid.ts
│   │   └── scoring.ts
│   │
│   ├── store/                   # 状态管理
│   │   ├── useAppStore.ts
│   │   └── useDataStore.ts
│   │
│   ├── types/                   # TypeScript 类型定义
│   │   ├── config.ts
│   │   ├── project.ts
│   │   └── weights.ts
│   │
│   ├── utils/                   # 工具函数
│   │   ├── dataLoader.ts
│   │   └── formatters.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

### 7. 部署方案

| 方案 | 命令 | URL |
|------|------|-----|
| 本地开发 | `npm run dev` | http://localhost:5173 |
| 构建生产 | `npm run build` | dist/ 目录 |
| GitHub Pages | `npm run deploy` | https://username.github.io/olympic-evaluation |
| Vercel | 连接 Git 仓库 | 自动部署 |

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| AHP 特征值计算精度 | JS 数值精度有限 | 使用幂迭代法足够精确，6×6 矩阵误差小 |
| 大数据量性能 | 项目数量增多可能卡顿 | 使用虚拟滚动，限制显示数量 |
| 浏览器兼容性 | 旧浏览器可能不支持 | Vite 自动处理，目标 es2020 |
| 数据加载失败 | JSON 文件加载异常 | 添加错误处理和加载状态 |
| 开发时间不足 | 功能简化 | 优先核心功能，可视化分阶段实现 |

## Open Questions

1. **框架选择**：React 还是 Vue？（建议 React，生态更大）
2. **是否支持判断矩阵在线编辑**？还是只展示预设值？
3. **预测算法**：简单评分排名还是加入历史趋势分析？
4. **是否需要导出功能**？（导出 CSV、截图等）