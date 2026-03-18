import type { Dimension } from '@/types';

interface SensitivityChartProps {
  data: { alpha: number; rankings: { id: string; rank: number }[] }[];
  dimensions: Dimension[];
  projectNames: Record<string, string>;
}

export default function SensitivityChart({ data, projectNames }: SensitivityChartProps) {
  const getTopProjects = () => {
    const firstRanking = data[0]?.rankings || [];
    return firstRanking.slice(0, 10);
  };

  const topProjects = getTopProjects();
  const colors = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">灵敏度分析</h3>
      <p className="text-sm text-gray-500 mb-4">
        展示排名随 α 参数变化的稳定性
      </p>
      
      <div className="overflow-x-auto">
        <svg width="700" height="400" viewBox="0 0 700 400">
          <text x="350" y="380" textAnchor="middle" className="text-sm fill-gray-600">
            α 参数
          </text>
          <text x="20" y="200" textAnchor="middle" transform="rotate(-90 20 200)" className="text-sm fill-gray-600">
            排名
          </text>
          
          {[1, 5, 10].map((rank) => (
            <g key={rank}>
              <line
                x1="60"
                y1={50 + (rank - 1) * 30}
                x2="680"
                y2={50 + (rank - 1) * 30}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text x="50" y={54 + (rank - 1) * 30} textAnchor="end" className="text-xs fill-gray-400">
                {rank}
              </text>
            </g>
          ))}
          
          {[0, 0.25, 0.5, 0.75, 1].map((alpha) => (
            <text
              key={alpha}
              x={60 + alpha * 620}
              y="365"
              textAnchor="middle"
              className="text-xs fill-gray-400"
            >
              {alpha}
            </text>
          ))}
          
          {topProjects.map((project, idx) => {
            const points = data.map((d) => {
              const ranking = d.rankings.find((r) => r.id === project.id);
              const rank = ranking?.rank || 10;
              const x = 60 + d.alpha * 620;
              const y = 50 + (rank - 1) * 30;
              return `${x},${y}`;
            }).join(' ');

            return (
              <g key={project.id}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={colors[idx % colors.length]}
                  strokeWidth="2"
                />
                <circle
                  cx="60"
                  cy={50 + ((data[0]?.rankings.find((r) => r.id === project.id)?.rank || 1) - 1) * 30}
                  r="4"
                  fill={colors[idx % colors.length]}
                />
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {topProjects.map((project, idx) => (
          <div key={project.id} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[idx % colors.length] }}
            />
            <span className="text-xs text-gray-600">{projectNames[project.id] || project.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}