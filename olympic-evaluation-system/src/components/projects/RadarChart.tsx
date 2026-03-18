import { useMemo } from 'react';
import type { Dimension, Indicators } from '@/types';

interface RadarChartProps {
  data: { name: string; indicators: Indicators }[];
  dimensions: Dimension[];
}

export default function RadarChart({ data, dimensions }: RadarChartProps) {
  const chartData = useMemo(() => {
    return {
      labels: dimensions.map((d) => d.name),
      datasets: data.map((item, index) => ({
        label: item.name,
        data: dimensions.map((d) => item.indicators[d.id as keyof Indicators] || 0),
        borderColor: ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6'][index % 5],
        backgroundColor: ['rgba(59, 130, 246, 0.1)', 'rgba(239, 68, 68, 0.1)', 'rgba(34, 197, 94, 0.1)', 'rgba(245, 158, 11, 0.1)', 'rgba(139, 92, 246, 0.1)'][index % 5],
      })),
    };
  }, [data, dimensions]);

  const maxValue = 1;
  const centerX = 200;
  const centerY = 200;
  const radius = 150;
  const angleStep = (2 * Math.PI) / dimensions.length;

  const getPointPosition = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">六维指标雷达图</h3>
      
      <div className="flex justify-center">
        <svg width="400" height="400" viewBox="0 0 400 400">
          {/* Grid circles */}
          {[0.25, 0.5, 0.75, 1].map((level) => (
            <circle
              key={level}
              cx={centerX}
              cy={centerY}
              r={radius * level}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Axis lines */}
          {dimensions.map((_, index) => {
            const pos = getPointPosition(index, 1);
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Labels */}
          {dimensions.map((dim, index) => {
            const pos = getPointPosition(index, 1.15);
            return (
              <text
                key={dim.id}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-gray-600"
              >
                {dim.name}
              </text>
            );
          })}
          
          {/* Data polygons */}
          {chartData.datasets.map((dataset, datasetIndex) => (
            <polygon
              key={datasetIndex}
              points={dataset.data
                .map((value, index) => {
                  const pos = getPointPosition(index, value);
                  return `${pos.x},${pos.y}`;
                })
                .join(' ')}
              fill={dataset.backgroundColor}
              stroke={dataset.borderColor}
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 flex-wrap">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: chartData.datasets[index].borderColor }}
            />
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}