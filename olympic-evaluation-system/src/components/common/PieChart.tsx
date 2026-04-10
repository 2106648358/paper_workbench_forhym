import { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';

interface PieChartProps {
  data: { name: string; value: number }[];
  title?: string;
  height?: number;
}

const CHART_COLORS = ['#c96442', '#d97757', '#5e5d59', '#87867f', '#4d4c48', '#3d3d3a'];

interface PieChartModalProps {
  data: { name: string; value: number }[];
  title?: string;
  onClose: () => void;
}

function PieChartModal({ data, title, onClose }: PieChartModalProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

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
              fontSize: 18,
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
        right: 20,
        top: 'center',
        textStyle: { fontSize: 13, color: '#5e5d59' },
      },
      series: [
        {
          type: 'pie',
          radius: ['25%', '60%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#faf9f5',
            borderWidth: 3,
          },
          label: {
            show: true,
            formatter: '{b}\n{d}%',
            fontSize: 12,
            color: '#5e5d59',
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 15,
            lineStyle: { color: '#d1cfc5' },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
            },
          },
          data: chartData,
          animationDuration: 1000,
          animationEasing: 'cubicOut',
        },
      ],
      color: CHART_COLORS,
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [data, title]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(20, 20, 19, 0.85)' }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl p-8"
        style={{
          backgroundColor: '#faf9f5',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          width: '80vw',
          maxWidth: 700,
          height: '80vh',
          maxHeight: 600,
          animation: 'modalAppear 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>
          {`
            @keyframes modalAppear {
              from {
                opacity: 0;
                transform: scale(0.9);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}
        </style>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ backgroundColor: '#e8e6dc', color: '#5e5d59' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}

export default function PieChart({ data, title, height = 300 }: PieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!chartRef.current || showModal) return;

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
          animationDuration: 800,
          animationEasing: 'cubicOut',
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
  }, [data, title, showModal]);

  const handleChartClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div
        className="rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg"
        style={{
          backgroundColor: '#faf9f5',
          border: '1px solid #f0eee6',
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
        }}
        onClick={handleChartClick}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
          <div ref={chartRef} style={{ width: '100%', height }} />
        </div>
      </div>

      {showModal && (
        <PieChartModal
          data={data}
          title={title}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}