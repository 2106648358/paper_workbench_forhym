import type { Dimension, Indicators } from '@/types';

interface ScoreBreakdownProps {
  indicators: Indicators;
  weights: Record<string, number>;
  dimensions: Dimension[];
  score: number;
}

export default function ScoreBreakdown({ indicators, weights, dimensions, score }: ScoreBreakdownProps) {
  const breakdown = dimensions.map((dim) => {
    const indicatorValue = indicators[dim.id as keyof Indicators] || 0;
    const weightValue = weights[dim.id] || 0;
    return {
      id: dim.id,
      name: dim.name,
      indicator: indicatorValue,
      weight: weightValue,
      contribution: indicatorValue * weightValue,
    };
  }).sort((a, b) => b.contribution - a.contribution);

  const maxContribution = Math.max(...breakdown.map((b) => b.contribution), 0.01);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">评分分解</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{score.toFixed(3)}</div>
          <div className="text-xs text-gray-500">综合评分</div>
        </div>
      </div>
      
      <div className="space-y-3">
        {breakdown.map((item) => (
          <div key={item.id} className="border-b border-gray-100 pb-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">{item.name}</span>
              <span className="text-gray-500">
                {item.indicator.toFixed(2)} × {item.weight.toFixed(3)} = {item.contribution.toFixed(3)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded transition-all duration-300"
                  style={{ width: `${(item.contribution / maxContribution) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-12 text-right">
                {((item.contribution / score) * 100 || 0).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}