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
      <div 
        className="rounded-xl p-6"
        style={{ 
          backgroundColor: '#faf9f5', 
          border: '1px solid #f0eee6',
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold font-serif" style={{ color: '#141413' }}>
              EWM 客观权重
            </h3>
            <div className="relative group">
              <svg
                className="w-4 h-4 cursor-help"
                style={{ color: '#87867f' }}
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
              <div 
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-60 p-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                style={{ 
                  backgroundColor: '#30302e', 
                  color: '#faf9f5',
                }}
              >
                <div className="font-medium mb-2 text-center">EWM 核心原理</div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#22c55e' }}>●</span>
                    <span>数据差异大 → 权重高</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#d97757' }}>●</span>
                    <span>数据差异小 → 权重低</span>
                  </div>
                </div>
                <div 
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                  style={{ backgroundColor: '#30302e' }}
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleRecalculate}
            disabled={isCalculating}
            className="px-4 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: isCalculating ? '#87867f' : '#c96442',
              color: '#faf9f5',
            }}
          >
            {isCalculating ? '计算中...' : '重新计算'}
          </button>
        </div>

        {isCalculating && (
          <div 
            className="mb-6 p-4 rounded-xl"
            style={{ backgroundColor: '#fef3ee' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="animate-spin rounded-full h-5 w-5 border-2"
                style={{ 
                  borderColor: '#c96442', 
                  borderTopColor: 'transparent' 
                }}
              />
              <span className="text-sm font-medium" style={{ color: '#c96442' }}>
                正在执行: {calcSteps.find(s => s.id === calcStep)?.label}
              </span>
            </div>
            <div className="flex gap-1">
              {calcSteps.map((step) => (
                <div key={step.id} className="flex-1 flex items-center gap-1">
                  <div
                    className="h-1.5 rounded-full transition-colors"
                    style={{
                      backgroundColor: step.id <= calcStep ? '#c96442' : '#e8e6dc',
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs" style={{ color: '#5e5d59' }}>
              {calcSteps.map((step) => (
                <span 
                  key={step.id} 
                  style={{ 
                    color: step.id === calcStep ? '#c96442' : '#87867f',
                    fontWeight: step.id === calcStep ? 500 : 400 
                  }}
                >
                  {step.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          {isCalculating ? (
            <div 
              className="flex flex-col items-center justify-center rounded-xl" 
              style={{ height: 320, width: '100%', maxWidth: 500, backgroundColor: '#e8e6dc' }}
            >
              <div className="relative w-32 h-32">
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{ border: '4px solid #d1cfc5' }}
                />
                <div 
                  className="absolute inset-0 rounded-full animate-spin"
                  style={{ 
                    border: '4px solid transparent',
                    borderTopColor: '#c96442' 
                  }}
                />
              </div>
              <p className="mt-4 text-sm" style={{ color: '#5e5d59' }}>计算中...</p>
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: 500 }}>
              <PieChart data={pieData} title="EWM 权重分布" height={320} />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        style={{ 
          backgroundColor: '#e8e6dc', 
          color: '#4d4c48',
        }}
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

      {showDetails && (
        <div 
          className="rounded-xl p-6 space-y-6"
          style={{ 
            backgroundColor: '#faf9f5', 
            border: '1px solid #f0eee6',
            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
          }}
        >
          <h4 className="font-semibold font-serif pb-2" style={{ color: '#141413', borderBottom: '1px solid #f0eee6' }}>
            计算过程详情
          </h4>
          
          <div>
            <h5 className="text-sm font-medium mb-3" style={{ color: '#4d4c48' }}>各指标信息熵</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {weightList.map((item) => {
                const D = 1 - item.entropy;
                return (
                  <div 
                    key={item.id} 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: '#e8e6dc' }}
                  >
                    <div className="text-sm font-medium mb-2" style={{ color: '#141413' }}>{item.name}</div>
                    <div className="flex justify-between text-xs mb-1" style={{ color: '#5e5d59' }}>
                      <span>熵值 H</span>
                      <span>{item.entropy.toFixed(3)}</span>
                    </div>
                    <div className="h-1.5 rounded overflow-hidden mb-2" style={{ backgroundColor: '#d1cfc5' }}>
                      <div 
                        className="h-full rounded" 
                        style={{ width: `${item.entropy * 100}%`, backgroundColor: '#d97757' }} 
                      />
                    </div>
                    <div className="flex justify-between text-xs" style={{ color: '#5e5d59' }}>
                      <span>效用值 D</span>
                      <span className="font-medium" style={{ color: '#16a34a' }}>{D.toFixed(3)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="p-3 rounded-xl text-xs"
              style={{ backgroundColor: '#fef3ee', color: '#5e5d59' }}
            >
              <strong>标准化公式：</strong>
              <code className="block mt-1" style={{ color: '#c96442' }}>x̃ = (x - min) / (max - min)</code>
            </div>
            <div 
              className="p-3 rounded-xl text-xs"
              style={{ backgroundColor: '#fef3ee', color: '#5e5d59' }}
            >
              <strong>熵权公式：</strong>
              <code className="block mt-1" style={{ color: '#c96442' }}>w = (1-H) / Σ(1-H)</code>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium mb-3" style={{ color: '#4d4c48' }}>原始数据预览（前5项）</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: '#e8e6dc' }}>
                    <th className="px-3 py-2 text-left" style={{ color: '#5e5d59' }}>项目</th>
                    {dimensions.map(dim => (
                      <th key={dim.id} className="px-3 py-2 text-center" style={{ color: '#5e5d59' }}>{dim.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.slice(0, 5).map((project, i) => (
                    <tr 
                      key={project.id}
                      style={{ borderBottom: '1px solid #f0eee6' }}
                    >
                      <td className="px-3 py-2 font-medium" style={{ color: '#141413' }}>{project.name}</td>
                      {dimensionIds.map((dimId, j) => (
                        <td key={dimId} className="px-3 py-2 text-center" style={{ color: '#5e5d59' }}>
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
