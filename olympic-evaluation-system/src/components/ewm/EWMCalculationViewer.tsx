import { useState, useMemo } from 'react';
import type { Project, Dimension, Indicators } from '@/types';
import { normalizeData, calculateEntropy, calculateEntropyWeights } from '@/lib';
import PieChart from '@/components/common/PieChart';

interface EWMCalculationViewerProps {
  projects: Project[];
  dimensions: Dimension[];
  ewmWeights: Record<string, number>;
  entropyValues: Record<string, number>;
}

export default function EWMCalculationViewer({
  projects,
  dimensions,
  ewmWeights,
  entropyValues,
}: EWMCalculationViewerProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcStep, setCalcStep] = useState(0);

  const dimensionIds = useMemo(() => dimensions.map(d => d.id), [dimensions]);

  const rawMatrix = useMemo(() => {
    return projects.map(p =>
      dimensionIds.map(id => p.indicators[id as keyof Indicators])
    );
  }, [projects, dimensionIds]);

  const calculatedEntropy = useMemo(() => {
    return calculateEntropy(normalizeData(rawMatrix));
  }, [rawMatrix]);

  const calculatedWeights = useMemo(() => {
    return calculateEntropyWeights(calculatedEntropy);
  }, [calculatedEntropy]);

  const handleRecalculate = () => {
    setIsCalculating(true);
    setCalcStep(1);
    
    const steps = [1, 2, 3, 4];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setCalcStep(steps[i]);
      } else {
        clearInterval(interval);
        setIsCalculating(false);
        setCalcStep(0);
      }
    }, 500);
  };

  const pieData = dimensions.map((dim, i) => ({
    name: dim.name,
    value: ewmWeights[dim.id] || calculatedWeights[i],
  }));

  const weightList = dimensions.map((dim, i) => ({
    name: dim.name,
    id: dim.id,
    weight: ewmWeights[dim.id] || calculatedWeights[i],
    entropy: entropyValues[dim.id] || calculatedEntropy[i],
  })).sort((a, b) => b.weight - a.weight);

  const calcSteps = [
    { id: 1, label: '数据标准化' },
    { id: 2, label: '比重计算' },
    { id: 3, label: '信息熵分析' },
    { id: 4, label: '权重归一化' },
  ];

  return (
    <div className="space-y-6">
      {/* 主结果卡片 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">EWM 客观权重</h3>
            {/* 信息图标 + Tooltip */}
            <div className="relative group">
              <svg
                className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {/* Tooltip - 向下显示 */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-60 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="font-medium mb-2 text-center">EWM 核心原理</div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">●</span>
                    <span>数据差异大 → 权重高</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">●</span>
                    <span>数据差异小 → 权重低</span>
                  </div>
                </div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
              </div>
            </div>
          </div>
          <button
            onClick={handleRecalculate}
            disabled={isCalculating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCalculating ? '计算中...' : '重新计算'}
          </button>
        </div>

        {/* 计算进度条 */}
        {isCalculating && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
              <span className="text-sm font-medium text-blue-700">
                正在执行: {calcSteps.find(s => s.id === calcStep)?.label}
              </span>
            </div>
            <div className="flex gap-1">
              {calcSteps.map((step) => (
                <div key={step.id} className="flex-1 flex items-center gap-1">
                  <div
                    className={`w-full h-1.5 rounded-full transition-colors ${
                      step.id <= calcStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {calcSteps.map((step) => (
                <span key={step.id} className={step.id === calcStep ? 'text-blue-600 font-medium' : ''}>
                  {step.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 饼图 / 加载动画 */}
        <div className="flex justify-center">
          {isCalculating ? (
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg" style={{ height: 320, width: '100%', maxWidth: 500 }}>
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
                <div className="absolute inset-0 border-4 border-purple-500 rounded-full animate-spin border-t-transparent" />
              </div>
              <p className="mt-4 text-sm text-gray-500">计算中...</p>
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: 500 }}>
              <PieChart data={pieData} title="EWM 权重分布" height={320} />
            </div>
          )}
        </div>
      </div>

      {/* 查看详情按钮 */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-colors flex items-center justify-center gap-2"
      >
        {showDetails ? '收起详情' : '查看详情'}
        <svg
          className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 详细内容（默认隐藏） */}
      {showDetails && (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h4 className="font-semibold text-gray-700 border-b pb-2">计算过程详情</h4>
          
          {/* 信息熵值 */}
          <div>
            <h5 className="text-sm font-medium text-gray-600 mb-3">各指标信息熵</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {weightList.map((item) => {
                const D = 1 - item.entropy;
                return (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium mb-2">{item.name}</div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>熵值 H</span>
                      <span>{item.entropy.toFixed(3)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded overflow-hidden mb-2">
                      <div className="h-full bg-amber-400 rounded" style={{ width: `${item.entropy * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>效用值 D</span>
                      <span className="text-green-600 font-medium">{D.toFixed(3)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 公式说明 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-xs">
              <strong>标准化公式：</strong>
              <code className="block mt-1 text-blue-700">x̃ = (x - min) / (max - min)</code>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg text-xs">
              <strong>熵权公式：</strong>
              <code className="block mt-1 text-amber-700">w = (1-H) / Σ(1-H)</code>
            </div>
          </div>

          {/* 原始数据预览 */}
          <div>
            <h5 className="text-sm font-medium text-gray-600 mb-3">原始数据预览（前5项）</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">项目</th>
                    {dimensions.map(dim => (
                      <th key={dim.id} className="px-3 py-2 text-center">{dim.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projects.slice(0, 5).map((project, i) => (
                    <tr key={project.id}>
                      <td className="px-3 py-2 font-medium">{project.name}</td>
                      {dimensionIds.map((dimId, j) => (
                        <td key={dimId} className="px-3 py-2 text-center text-gray-600">
                          {rawMatrix[i][j].toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}