# 开发指南

## 环境配置

### 必要条件

- **Node.js**: >= 18.0.0
- **包管理器**: npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 (http://localhost:5173) |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | 运行 ESLint 检查 |
| `npm run test` | 运行单元测试 |

## 项目结构

```
olympic-evaluation-system/
├── public/
│   └── data/                    # 静态 JSON 数据
│       ├── config.json
│       ├── ahp/
│       ├── ewm/
│       └── projects/
│
├── src/
│   ├── components/              # UI 组件
│   │   ├── ahp/                # AHP 相关组件
│   │   │   ├── JudgmentMatrix.tsx
│   │   │   ├── WeightsChart.tsx
│   │   │   └── ExpertComparison.tsx
│   │   ├── ewm/                # EWM 相关组件
│   │   │   ├── RawDataTable.tsx
│   │   │   ├── EntropyValues.tsx
│   │   │   └── EWMCalculationViewer.tsx
│   │   ├── hybrid/              # 混合权重组件
│   │   │   ├── AlphaSlider.tsx
│   │   │   └── SensitivityChart.tsx
│   │   ├── projects/            # 项目评估组件
│   │   │   ├── RadarChart.tsx
│   │   │   ├── RankingTable.tsx
│   │   │   ├── ScoreBreakdown.tsx
│   │   │   └── ProjectCompare.tsx
│   │   ├── prediction/          # 预测推荐组件
│   │   │   ├── ProbabilityChart.tsx
│   │   │   ├── PredictionSummary.tsx
│   │   │   └── RecommendationCard.tsx
│   │   └── common/              # 通用组件
│   │       ├── Layout.tsx
│   │       ├── Sidebar.tsx
│   │       ├── PieChart.tsx
│   │       └── CollapsibleSection.tsx
│   │
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useData.ts           # 数据加载 Hook
│   │   └── index.ts
│   │
│   ├── lib/                     # 计算逻辑
│   │   ├── calculation.ts       # AHP/EWM 核心算法
│   │   └── index.ts
│   │
│   ├── store/                   # 状态管理
│   │   └── index.ts             # Zustand store
│   │
│   ├── types/                   # TypeScript 类型
│   │   └── index.ts
│   │
│   ├── utils/                   # 工具函数
│   │   ├── export.ts            # 导出功能
│   │   └── index.ts
│   │
│   ├── App.tsx                  # 应用入口
│   ├── main.tsx                 # React 渲染入口
│   └── index.css                # 全局样式
│
├── docs/                        # 本文档目录
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   └── API.md
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 组件开发规范

### 命名规范

- **组件文件**: PascalCase (如 `RankingTable.tsx`)
- **组件名**: PascalCase (如 `function RankingTable`)
- **样式类**: Tailwind CSS (如 `className="bg-white rounded-lg"`)

### 组件结构模板

```tsx
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';

interface ComponentProps {
  // Props 定义
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Local state if needed
  const [localState, setLocalState] = useState(initialValue);
  
  // Global state from store
  const { state, setState } = useAppStore();
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Handlers
  const handleClick = () => {
    // Event handlers
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* JSX */}
    </div>
  );
}
```

### 使用 ECharts

组件库使用 `echarts-for-react`:

```tsx
import ReactECharts from 'echarts-for-react';

function ChartComponent({ data }) {
  const option = {
    xAxis: { type: 'category', data: data.names },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: data.values }],
  };
  
  return (
    <ReactECharts 
      option={option} 
      style={{ height: '300px' }}
    />
  );
}
```

## 状态管理

### Zustand Store

状态定义在 `src/store/index.ts`:

```typescript
interface AppStore {
  // State
  alpha: number;
  judgmentMatrix: number[][];
  projects: Project[];
  weights: { ahp: Record<string, number>; ewm: Record<string, number>; hybrid: Record<string, number> };
  selectedProjects: string[];
  
  // Actions
  setAlpha: (alpha: number) => void;
  setJudgmentMatrix: (matrix: number[][]) => void;
  setWeights: (type: 'ahp' | 'ewm' | 'hybrid', weights: Record<string, number>) => void;
  toggleProjectSelection: (id: string) => void;
  setProjects: (projects: Project[]) => void;
}
```

### 自定义 Hooks

| Hook | 用途 |
|------|------|
| `useConfig()` | 加载系统配置 |
| `useJudgmentMatrix()` | 加载判断矩阵数据 |
| `useAHPWeights()` | 加载 AHP 权重结果 |
| `useEWMWeights()` | 加载 EWM 权重结果 |
| `useProjects()` | 加载项目数据 |

## 测试

### 运行测试

```bash
npm run test          # 运行所有测试
npm run test:watch    # 监听模式
```

### 测试文件结构

```
src/
├── test/
│   ├── setup.ts       # 测试环境配置
│   └── calculation.test.ts  # 计算函数测试
```

### 测试示例

```typescript
import { describe, it, expect } from 'vitest';
import { calculateAHPWeights } from '@/lib/calculation';

describe('AHP Weight Calculation', () => {
  it('should calculate correct weights for a consistent matrix', () => {
    // 1 1 1
    // 1 1 1
    // 1 1 1
    const matrix = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    
    const result = calculateAHPWeights(matrix);
    expect(result.weights).toBeDefined();
    expect(result.consistency.passed).toBe(true);
  });
});
```

## 扩展开发

### 添加新指标

1. 在 `public/data/config.json` 的 `dimensions` 数组中添加新维度
2. 在 `src/types/index.ts` 的 `Indicators` 接口中添加字段
3. 更新 `src/lib/calculation.ts` 中的 `dimensionIds` 数组
4. 在对应的 JSON 数据文件中添加指标数据

### 添加新组件

1. 在 `src/components/` 相应子目录下创建组件文件
2. 遵循组件命名规范
3. 在需要使用的页面中导入并使用
