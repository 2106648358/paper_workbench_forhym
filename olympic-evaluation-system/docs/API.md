# 算法文档

本文档介绍系统中使用的核心算法实现，包括 AHP 层次分析法、EWM 熵权法、以及混合权重计算模型。

## AHP 层次分析法

### 算法原理

AHP（Analytic Hierarchy Process）通过构建判断矩阵，将专家的主观判断转化为客观权重。

### 幂迭代法求特征向量

```typescript
function powerIteration(
  matrix: number[][],
  maxIter: number = 100,
  tolerance: number = 1e-10
): { eigenvalue: number; eigenvector: number[] }
```

**算法步骤：**
1. 初始化特征向量 v 为均匀分布 (1/n, 1/n, ...)
2. 迭代计算 v = Av / ||Av||
3. 收敛判断：||v_new - v_old|| < tolerance
4. 计算特征值 λ = Σ(Av[i] * v[i])

### 一致性检验

```typescript
function consistencyRatio(
  matrix: number[][],
  lambdaMax: number
): { CI: number; CR: number; passed: boolean }
```

**公式：**
- CI = (λmax - n) / (n - 1)  （一致性指标）
- CR = CI / RI               （一致性比率）

其中 RI 是随机一致性指标：

| n | RI |
|---|-----|
| 3 | 0.52 |
| 4 | 0.89 |
| 5 | 1.12 |
| 6 | 1.26 |
| 7 | 1.36 |
| 8 | 1.41 |
| 9 | 1.46 |

当 CR < 0.1 时，认为判断矩阵具有满意的一致性。

### 多专家矩阵几何平均

```typescript
function geometricMean(matrices: number[][][]): number[][]
```

对 k 位专家的判断矩阵取几何平均：

```
A[i][j] = (A₁[i][j] × A₂[i][j] × ... × Ak[i][j])^(1/k)
```

## EWM 熵权法

### 算法原理

EWM（Entropy Weight Method）根据指标数据的变异程度确定权重，信息熵越小，指标的区分度越大，权重越高。

### 数据标准化

```typescript
function normalizeData(
  data: number[][],
  directions: ('positive' | 'negative')[] = []
): number[][]
```

**Min-Max 标准化：**

对于正向指标：
```
x' = (x - min) / (max - min)
```

对于负向指标：
```
x' = (max - x) / (max - min)
```

### 信息熵计算

```typescript
function calculateEntropy(normalizedData: number[][]): number[]
```

**计算步骤：**
1. 计算第 j 个指标在第 i 个项目上的比重 pij = xij / Σxij
2. 计算第 j 个指标的信息熵 Hj = -1/ln(n) × Σ(pij × ln(pij))
3. 当 pij = 0 时，约定 0 × ln(0) = 0

### 熵权计算

```typescript
function calculateEntropyWeights(entropyValues: number[]): number[]
```

**公式：**
- dj = 1 - Hj（差异系数）
- wj = dj / Σdj（权重）

## 混合权重计算

### 公式

```typescript
function combineWeights(
  ahpWeights: Record<string, number>,
  ewmWeights: Record<string, number>,
  alpha: number = 0.5
): Record<string, number>
```

**混合权重公式：**
```
W_hybrid = α × W_ahp + (1 - α) × W_ewm
```

其中 α ∈ [0, 1] 是调节参数：
- α = 1：完全使用 AHP 主观权重
- α = 0：完全使用 EWM 客观权重
- α = 0.5：各占一半

## 项目评分与排名

### 综合评分计算

```typescript
function calculateProjectScore(
  indicators: Indicators,
  weights: Record<string, number>
): number
```

**公式：**
```
Score = Σ(indicator_i × weight_i)
```

其中 indicator_i ∈ [0, 1]，weight_i ∈ [0, 1] 且 Σweight_i = 1。

### 项目排名

```typescript
function rankProjects(
  projects: { id: string; name: string; indicators: Indicators }[],
  weights: Record<string, number>
): { id: string; name: string; score: number; rank: number }[]
```

**步骤：**
1. 计算每个项目的综合评分
2. 按评分降序排列
3. 分配排名（1, 2, 3, ...）

## 入选概率预测

### 公式

```typescript
function calculateProbability(
  score: number,
  allScores: number[]
): number
```

**基于 logistic 变换的概率计算：**
1. 计算所有项目评分的均值 μ 和标准差 σ
2. 计算标准化分数 z = (score - μ) / σ
3. 计算概率 P = 1 / (1 + e^(-2z))

**概率解读：**
- P >= 0.7：高概率入选
- 0.4 <= P < 0.7：中等概率
- P < 0.4：可能淘汰

## 灵敏度分析

### 分析方法

```typescript
function sensitivityAnalysis(
  projects: { id: string; name: string; indicators: Indicators }[],
  ahpWeights: Record<string, number>,
  ewmWeights: Record<string, number>,
  alphaSteps: number = 10
): { alpha: number; rankings: { id: string; rank: number }[] }[]
```

在不同 α 值下（0, 0.1, 0.2, ..., 1.0）计算项目排名，观察排名稳定性。

## 使用示例

```typescript
import { 
  calculateAHPWeights, 
  calculateEWMWeights, 
  combineWeights,
  rankProjects,
  calculateProbability 
} from '@/lib/calculation';

// 1. 计算 AHP 权重
const ahpResult = calculateAHPWeights(judgmentMatrix);

// 2. 计算 EWM 权重
const ewmResult = calculateEWMWeights(projects);

// 3. 混合权重
const hybrid = combineWeights(ahpResult.weights, ewmResult.normalizedWeights, 0.5);

// 4. 项目排名
const rankings = rankProjects(projects, hybrid);

// 5. 计算入选概率
const allScores = rankings.map(r => r.score);
const probability = calculateProbability(rankings[0].score, allScores);
```

## 六维指标

| 指标 | ID | 计算说明 |
|------|-----|---------|
| 流行度 | popularity | 基于项目参与人数、观众规模、媒体曝光等数据标准化 |
| 性别平等 | gender_equity | 基于男女参赛比例、奖金平等程度等计算 |
| 可持续性 | sustainability | 基于场地需求、资源消耗、碳排放等评估 |
| 包容性 | inclusivity | 基于残障运动员参与度、地区覆盖度等衡量 |
| 创新性 | innovation | 基于技术创新、赛制创新、数字化程度评估 |
| 安全性 | safety | 基于运动损伤率、医疗保障、风险管理评估 |
