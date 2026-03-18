import { useMemo } from 'react';
import type { Project, Dimension, Indicators } from '@/types';

interface RecommendationCardProps {
  project: Project;
  weights: Record<string, number>;
  dimensions: Dimension[];
  avgIndicators: Record<string, number>;
}

export default function RecommendationCard({ project, weights, dimensions, avgIndicators }: RecommendationCardProps) {
  const analysis = useMemo(() => {
    const weakDimensions = dimensions
      .map((dim) => ({
        id: dim.id,
        name: dim.name,
        value: project.indicators[dim.id as keyof Indicators] || 0,
        avg: avgIndicators[dim.id] || 0,
        weight: weights[dim.id] || 0,
        gap: (avgIndicators[dim.id] || 0) - (project.indicators[dim.id as keyof Indicators] || 0),
      }))
      .filter((d) => d.gap > 0)
      .sort((a, b) => b.gap * b.weight - a.gap * a.weight);

    const suggestions = weakDimensions.slice(0, 3).map((d) => {
      const targetValue = Math.min(1, d.avg + 0.1);
      const improvement = targetValue - d.value;
      const scoreIncrease = improvement * d.weight;
      
      return {
        dimension: d.name,
        currentValue: d.value,
        targetValue,
        improvement,
        scoreIncrease,
        impact: d.weight > 0.15 ? '高' : d.weight > 0.1 ? '中' : '低',
      };
    });

    return { weakDimensions, suggestions };
  }, [project, weights, dimensions, avgIndicators]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">改进建议</h3>
        <span className="text-sm text-gray-500">{project.name}</span>
      </div>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">当前评分</span>
          <span className="text-lg font-bold text-blue-600">{project.score?.toFixed(3) || '-'}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-gray-600">当前排名</span>
          <span className="text-lg font-bold text-gray-700">#{project.rank || '-'}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-gray-600">入选概率</span>
          <span className="text-lg font-bold text-green-600">
            {((project.probability || 0) * 100).toFixed(0)}%
          </span>
        </div>
      </div>
      
      {analysis.suggestions.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">提升建议</h4>
          {analysis.suggestions.map((s, idx) => (
            <div key={idx} className="border-l-4 border-blue-300 pl-3 py-2 bg-blue-50 rounded-r">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{s.dimension}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  s.impact === '高' ? 'bg-green-100 text-green-700' :
                  s.impact === '中' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  影响度: {s.impact}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                当前 {s.currentValue.toFixed(2)} → 建议提升至 {s.targetValue.toFixed(2)}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                预计可提升评分 +{s.scoreIncrease.toFixed(3)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          该项目各项指标表现良好
        </div>
      )}
    </div>
  );
}