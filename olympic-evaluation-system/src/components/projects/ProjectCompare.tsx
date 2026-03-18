import type { Project, Dimension, Indicators } from '@/types';

interface ProjectCompareProps {
  projects: Project[];
  weights: Record<string, number>;
  dimensions: Dimension[];
}

export default function ProjectCompare({ projects, weights, dimensions }: ProjectCompareProps) {
  if (projects.length < 2) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">项目对比</h3>
        <p className="text-gray-500 text-center py-8">
          请选择至少两个项目进行对比
        </p>
      </div>
    );
  }

  const calculateScore = (indicators: Indicators) => {
    return dimensions.reduce((sum, dim) => {
      return sum + (indicators[dim.id as keyof Indicators] || 0) * (weights[dim.id] || 0);
    }, 0);
  };

  const compareData = projects.map((p) => ({
    ...p,
    calculatedScore: calculateScore(p.indicators),
  })).sort((a, b) => b.calculatedScore - a.calculatedScore);

  const maxIndicator = 1;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">项目对比分析</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">指标</th>
              {compareData.map((p, idx) => (
                <th key={p.id} className="text-center py-2 px-3 text-sm font-medium">
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6'][idx % 5] }}
                    />
                    {p.name}
                  </div>
                </th>
              ))}
              <th className="text-center py-2 px-3 text-sm font-medium text-gray-500">差异</th>
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dim) => (
              <tr key={dim.id} className="border-b">
                <td className="py-2 px-3 text-sm font-medium text-gray-700">{dim.name}</td>
                {compareData.map((p, idx) => {
                  const value = p.indicators[dim.id as keyof Indicators] || 0;
                  const color = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6'][idx % 5];
                  return (
                    <td key={p.id} className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded overflow-hidden">
                          <div
                            className="h-full rounded"
                            style={{ width: `${(value / maxIndicator) * 100}%`, backgroundColor: color }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-10">{value.toFixed(2)}</span>
                      </div>
                    </td>
                  );
                })}
                <td className="py-2 px-3 text-center text-sm text-gray-500">
                  {(Math.max(...compareData.map((p) => p.indicators[dim.id as keyof Indicators] || 0)) -
                    Math.min(...compareData.map((p) => p.indicators[dim.id as keyof Indicators] || 0))).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-medium">
              <td className="py-2 px-3 text-sm text-gray-700">综合评分</td>
              {compareData.map((p) => (
                <td key={p.id} className="py-2 px-3 text-center text-sm text-blue-600">
                  {p.calculatedScore.toFixed(3)}
                </td>
              ))}
              <td className="py-2 px-3 text-center text-sm text-gray-500">
                {(Math.max(...compareData.map((p) => p.calculatedScore)) -
                  Math.min(...compareData.map((p) => p.calculatedScore))).toFixed(3)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}