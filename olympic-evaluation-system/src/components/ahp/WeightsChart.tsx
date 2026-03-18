import type { Dimension } from '@/types';

interface WeightsChartProps {
  weights: Record<string, number>;
  dimensions: Dimension[];
  title?: string;
  color?: string;
}

export default function WeightsChart({
  weights,
  dimensions,
  title = '权重分布',
  color = '#3b82f6',
}: WeightsChartProps) {
  const maxWeight = Math.max(...Object.values(weights), 0.01);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <div className="space-y-3">
        {dimensions.map((dim) => {
          const weight = weights[dim.id] || 0;
          const percentage = (weight / maxWeight) * 100;
          
          return (
            <div key={dim.id} className="flex items-center gap-3">
              <span className="w-20 text-sm text-gray-600">{dim.name}</span>
              <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <span className="w-12 text-sm font-medium text-right">
                {(weight * 100).toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}