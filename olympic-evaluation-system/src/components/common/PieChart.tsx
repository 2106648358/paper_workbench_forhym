import { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';

interface PieChartProps {
  data: { name: string; value: number }[];
  title?: string;
  height?: number;
  enable3D?: boolean;
}

const CHART_COLORS = ['#c96442', '#d97757', '#5e5d59', '#87867f', '#4d4c48', '#3d3d3a'];

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
      value: Math.max(0.001, item.value * 100),
    }));

    const option = is3D
      ? {
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
              return `${p.name}<br/>权重: ${(p.value / 100).toFixed(4)} (${p.percent.toFixed(1)}%)`;
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
              radius: ['35%', '70%'],
              center: ['40%', '50%'],
              avoidLabelOverlap: true,
              label: {
                show: true,
                formatter: '{b}\n{d}%',
                fontSize: 11,
                color: '#5e5d59',
              },
              labelLine: {
                show: true,
                length: 15,
                length2: 10,
                lineStyle: { color: '#d1cfc5' },
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 15,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.3)',
                },
              },
              data: chartData,
              shading: 'realistic',
              realisticMaterial: {
                roughness: 0.6,
                metalness: 0.1,
              },
              light: {
                main: {
                  intensity: 1.2,
                  shadow: true,
                  shadowQuality: 'high',
                },
              },
            },
          ],
          color: CHART_COLORS,
        } as echarts.EChartsOption
      : {
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
              return `${p.name}<br/>权重: ${(p.value / 100).toFixed(4)} (${p.percent.toFixed(1)}%)`;
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
        } as echarts.EChartsOption;

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
          className="px-3 py-1.5 text-xs rounded-lg transition-all duration-200"
          style={{
            backgroundColor: is3D ? '#c96442' : '#e8e6dc',
            color: is3D ? '#faf9f5' : '#5e5d59',
            boxShadow: is3D ? '0px 0px 8px rgba(201, 100, 66, 0.4)' : 'none',
          }}
        >
          {is3D ? '2D' : '3D'}
        </button>
      </div>
      <div ref={chartRef} style={{ height }} />
    </div>
  );
}
