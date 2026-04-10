import { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';

interface PieChartProps {
  data: { name: string; value: number }[];
  title?: string;
  height?: number;
  enable3D?: boolean;
}

const CHART_COLORS = ['#c96442', '#d97757', '#5e5d59', '#87867f', '#4d4c48', '#3d3d3a'];

function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

function PieChart3D({
  data,
  height = 300,
}: {
  data: { name: string; value: number; color: string }[];
  height: number;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const size = Math.min(height * 0.8, 400);
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size * 0.4;
  const innerRadius = size * 0.2;
  const maxHeight = size * 0.15;

  let currentAngle = -Math.PI / 2;

  const slices = data.map((item) => {
    const percent = item.value / total;
    const angle = percent * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    const height = maxHeight * (0.5 + percent * 0.5);

    const path = describeArc(cx, cy, outerRadius, startAngle, endAngle);
    const innerPath = describeArc(cx, cy, innerRadius, startAngle, endAngle);

    const slice = {
      ...item,
      percent,
      startAngle,
      endAngle,
      height,
      path,
      innerPath,
      color: item.color,
      darkColor: shadeColor(item.color, -25),
      darkerColor: shadeColor(item.color, -40),
    };

    currentAngle = endAngle;
    return slice;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      <defs>
        {slices.map((slice, i) => (
          <linearGradient key={`grad-${i}`} id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={slice.color} />
            <stop offset="100%" stopColor={slice.darkColor} />
          </linearGradient>
        ))}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.2" />
        </filter>
      </defs>

      {slices.map((slice, i) => {
        const sidePath = `
          M ${cx + Math.cos(slice.startAngle) * outerRadius} ${cy + Math.sin(slice.startAngle) * outerRadius + slice.height}
          L ${cx + Math.cos(slice.startAngle) * outerRadius} ${cy + Math.sin(slice.startAngle) * outerRadius}
          A ${outerRadius} ${outerRadius} 0 0 1 ${cx + Math.cos(slice.endAngle) * outerRadius} ${cy + Math.sin(slice.endAngle) * outerRadius}
          L ${cx + Math.cos(slice.endAngle) * outerRadius} ${cy + Math.sin(slice.endAngle) * outerRadius + slice.height}
          A ${outerRadius} ${outerRadius} 0 0 0 ${cx + Math.cos(slice.startAngle) * outerRadius} ${cy + Math.sin(slice.startAngle) * outerRadius + slice.height}
          Z
        `;

        const topPath = `
          M ${cx + Math.cos(slice.startAngle) * innerRadius} ${cy + Math.sin(slice.startAngle) * innerRadius}
          L ${cx + Math.cos(slice.startAngle) * outerRadius} ${cy + Math.sin(slice.startAngle) * outerRadius}
          A ${outerRadius} ${outerRadius} 0 0 1 ${cx + Math.cos(slice.endAngle) * outerRadius} ${cy + Math.sin(slice.endAngle) * outerRadius}
          L ${cx + Math.cos(slice.endAngle) * innerRadius} ${cy + Math.sin(slice.endAngle) * innerRadius}
          A ${innerRadius} ${innerRadius} 0 0 0 ${cx + Math.cos(slice.startAngle) * innerRadius} ${cy + Math.sin(slice.startAngle) * innerRadius}
          Z
        `;

        const innerCylinderPath = `
          M ${cx + Math.cos(slice.startAngle) * innerRadius} ${cy + Math.sin(slice.startAngle) * innerRadius + slice.height}
          L ${cx + Math.cos(slice.startAngle) * innerRadius} ${cy + Math.sin(slice.startAngle) * innerRadius}
          A ${innerRadius} ${innerRadius} 0 0 1 ${cx + Math.cos(slice.endAngle) * innerRadius} ${cy + Math.sin(slice.endAngle) * innerRadius}
          L ${cx + Math.cos(slice.endAngle) * innerRadius} ${cy + Math.sin(slice.endAngle) * innerRadius + slice.height}
          A ${innerRadius} ${innerRadius} 0 0 0 ${cx + Math.cos(slice.startAngle) * innerRadius} ${cy + Math.sin(slice.startAngle) * innerRadius + slice.height}
          Z
        `;

        return (
          <g key={i}>
            <path d={sidePath} fill={slice.darkerColor} />
            <path d={innerCylinderPath} fill={slice.darkerColor} />
            <path d={topPath} fill={`url(#grad-${i})`} filter="url(#shadow)" />
            <path
              d={`M ${cx + Math.cos(slice.startAngle) * outerRadius} ${cy + Math.sin(slice.startAngle) * outerRadius + slice.height}
                A ${outerRadius} ${outerRadius} 0 0 1 ${cx + Math.cos(slice.endAngle) * outerRadius} ${cy + Math.sin(slice.endAngle) * outerRadius + slice.height}`}
              fill="none"
              stroke={slice.color}
              strokeWidth="1"
              strokeOpacity="0.3"
            />
          </g>
        );
      })}

      {slices.map((slice, i) => {
        const midAngle = (slice.startAngle + slice.endAngle) / 2;
        const labelRadius = (outerRadius + innerRadius) / 2 * 1.3;
        const labelX = cx + Math.cos(midAngle) * labelRadius;
        const labelY = cy + Math.sin(midAngle) * labelRadius;

        if (slice.percent < 0.05) return null;

        return (
          <text
            key={`label-${i}`}
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fill="#5e5d59"
            fontFamily="'Inter', sans-serif"
          >
            {`${(slice.percent * 100).toFixed(0)}%`}
          </text>
        );
      })}

      <circle cx={cx} cy={cy + maxHeight + 20} r="0" />
    </svg>
  );
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = {
    x: x + radius * Math.cos(startAngle),
    y: y + radius * Math.sin(startAngle),
  };
  const end = {
    x: x + radius * Math.cos(endAngle),
    y: y + radius * Math.sin(endAngle),
  };
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 1, end.x, end.y,
  ].join(' ');
}

export default function PieChart({ data, title, height = 300, enable3D = false }: PieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [is3D, setIs3D] = useState(enable3D);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chartData = data.map((item) => ({
      name: item.name,
      value: Math.max(0.001, item.value),
    }));

    const option: echarts.EChartsOption = {
      title: title
        ? {
            text: title,
            left: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Playfair Display', Georgia, serif",
              color: '#141413'
            },
          }
        : undefined,
      tooltip: {
        trigger: 'item',
        backgroundColor: '#faf9f5',
        borderColor: '#f0eee6',
        borderWidth: 1,
        textStyle: { color: '#141413' },
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number; percent: number };
          return `${p.name}<br/>权重: ${p.value.toFixed(4)} (${p.percent.toFixed(1)}%)`;
        },
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: { fontSize: 11, color: '#5e5d59' },
      },
      series: [
        {
          type: 'pie',
          radius: ['20%', '55%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#faf9f5',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}\n{d}%',
            fontSize: 10,
            color: '#5e5d59',
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 10,
            lineStyle: { color: '#d1cfc5' },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.15)',
            },
          },
          data: chartData,
        },
      ],
      color: CHART_COLORS,
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, title, is3D]);

  const toggle3D = () => {
    setIs3D(!is3D);
  };

  const chartData = data.map((item, index) => ({
    name: item.name,
    value: item.value,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: '#faf9f5',
        border: '1px solid #f0eee6',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        {title && <h4 className="text-sm font-semibold font-serif" style={{ color: '#141413' }}>{title}</h4>}
        <button
          onClick={toggle3D}
          className="px-3 py-1.5 text-xs rounded-lg transition-all duration-300"
          style={{
            backgroundColor: is3D ? '#c96442' : '#e8e6dc',
            color: is3D ? '#faf9f5' : '#5e5d59',
            boxShadow: is3D ? '0px 0px 12px rgba(201, 100, 66, 0.5)' : 'none',
          }}
        >
          {is3D ? '2D' : '3D'}
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
        {is3D ? (
          <PieChart3D data={chartData} height={height} />
        ) : (
          <div ref={chartRef} style={{ width: '100%', height }} />
        )}
      </div>
    </div>
  );
}
