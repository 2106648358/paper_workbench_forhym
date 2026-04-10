import { useMemo } from 'react';
import type { Dimension, Indicators } from '@/types';

interface RadarChartProps {
  data: { name: string; indicators: Indicators }[];
  dimensions: Dimension[];
}

const CHART_COLORS = ['#c96442', '#d97757', '#5e5d59', '#87867f', '#4d4c48'];

export default function RadarChart({ data, dimensions }: RadarChartProps) {
  const chartData = useMemo(() => {
    return {
      labels: dimensions.map((d) => d.name),
      datasets: data.map((item, index) => ({
        label: item.name,
        data: dimensions.map((d) => item.indicators[d.id as keyof Indicators] || 0),
        borderColor: CHART_COLORS[index % 5],
        backgroundColor: CHART_COLORS[index % 5] + '33',
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
    <div 
      className="rounded-xl p-6"
      style={{ 
        backgroundColor: '#faf9f5', 
        border: '1px solid #f0eee6',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
      }}
    >
      <h3 className="text-lg font-semibold font-serif mb-2" style={{ color: '#141413' }}>
        六维指标雷达图
      </h3>
      <p className="text-sm mb-4" style={{ color: '#5e5d59' }}>
        展示选中项目的六维指标分布，便于对比分析
      </p>

      <div className="flex justify-center">
        <svg width="400" height="400" viewBox="0 0 400 400">
          {[0.25, 0.5, 0.75, 1].map((level) => (
            <g key={level}>
              <circle
                cx={centerX}
                cy={centerY}
                r={radius * level}
                fill="none"
                stroke="#e8e6dc"
                strokeWidth="1"
                strokeDasharray={level === 1 ? '0' : '4'}
              />
              {level !== 1 && (
                <text
                  x={centerX + 5}
                  y={centerY - radius * level}
                  fontSize="10"
                  fill="#87867f"
                >
                  {(level * 100).toFixed(0)}
                </text>
              )}
            </g>
          ))}

          {dimensions.map((_, index) => {
            const pos = getPointPosition(index, 1);
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke="#d1cfc5"
                strokeWidth="1"
              />
            );
          })}

          {dimensions.map((dim, index) => {
            const pos = getLabelPosition(index, 1.25);
            const textWidth = dim.name.length * 14 + 12;
            return (
              <g key={dim.id}>
                <rect
                  x={pos.x - textWidth / 2}
                  y={pos.y - 10}
                  width={textWidth}
                  height={20}
                  rx={6}
                  fill="#faf9f5"
                  stroke="#e8e6dc"
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="500"
                  fill="#4d4c48"
                >
                  {dim.name}
                </text>
              </g>
            );
          })}

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
                style={{ transition: 'all 0.3s ease' }}
              />
              {dataset.data.map((value, index) => {
                const pos = getPointPosition(index, value);
                return (
                  <g key={index}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={5}
                      fill={dataset.borderColor}
                      stroke="#faf9f5"
                      strokeWidth={2}
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 10}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="500"
                      fill="#5e5d59"
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

      <div className="flex justify-center gap-4 mt-4 flex-wrap">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: chartData.datasets[index].borderColor }}
            />
            <span className="text-sm" style={{ color: '#5e5d59' }}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
