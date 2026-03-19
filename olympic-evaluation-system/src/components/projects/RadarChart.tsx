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
        backgroundColor: ['rgba(59, 130, 246, 0.2)', 'rgba(239, 68, 68, 0.2)', 'rgba(34, 197, 94, 0.2)', 'rgba(245, 158, 11, 0.2)', 'rgba(139, 92, 246, 0.2)'][index % 5],
      })),
    };
  }, [data, dimensions]);

  const maxValue = 1;
  const centerX = 200;
  const centerY = 200;
  const radius = 140;
  const angleStep = (2 * Math.PI) / dimensions.length;

  const getPointPosition = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  };

  const getLabelPosition = (index: number, offset: number = 1.2) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * offset;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-2">六维指标雷达图</h3>
      <p className="text-sm text-gray-500 mb-4">展示选中项目的六维指标分布，便于对比分析</p>

      <div className="flex justify-center">
        <svg width="400" height="400" viewBox="0 0 400 400">
          {/* Grid circles with labels */}
          {[0.25, 0.5, 0.75, 1].map((level) => (
            <g key={level}>
              <circle
                cx={centerX}
                cy={centerY}
                r={radius * level}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray={level === 1 ? '0' : '4'}
              />
              {level !== 1 && (
                <text
                  x={centerX + 5}
                  y={centerY - radius * level}
                  className="text-[10px] fill-gray-400"
                >
                  {(level * 100).toFixed(0)}
                </text>
              )}
            </g>
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
                stroke="#d1d5db"
                strokeWidth="1"
              />
            );
          })}

          {/* Dimension labels with background */}
          {dimensions.map((dim, index) => {
            const pos = getLabelPosition(index, 1.25);
            const textWidth = dim.name.length * 7 + 10;
            return (
              <g key={dim.id}>
                <rect
                  x={pos.x - textWidth / 2}
                  y={pos.y - 10}
                  width={textWidth}
                  height={20}
                  rx={4}
                  fill="white"
                  stroke="#e5e7eb"
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium fill-gray-700"
                >
                  {dim.name}
                </text>
              </g>
            );
          })}

          {/* Data polygons with animation */}
          {chartData.datasets.map((dataset, datasetIndex) => (
            <g key={datasetIndex}>
              <polygon
                points={dataset.data
                  .map((value, index) => {
                    const pos = getPointPosition(index, value);
                    return `${pos.x},${pos.y}`;
                  })
                  .join(' ')}
                fill={dataset.backgroundColor}
                stroke={dataset.borderColor}
                strokeWidth="2"
                className="transition-all duration-300"
              />
              {/* Data points with values */}
              {dataset.data.map((value, index) => {
                const pos = getPointPosition(index, value);
                return (
                  <g key={index}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={4}
                      fill={dataset.borderColor}
                      stroke="white"
                      strokeWidth={2}
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 10}
                      textAnchor="middle"
                      className="text-[9px] font-medium fill-gray-600"
                    >
                      {value.toFixed(2)}
                    </text>
                  </g>
                );
              })}
            </g>
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