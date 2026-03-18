import type { Project } from '@/types';

interface ProbabilityChartProps {
  projects: Project[];
}

export default function ProbabilityChart({ projects }: ProbabilityChartProps) {
  const sortedProjects = [...projects]
    .filter((p) => p.probability !== undefined)
    .sort((a, b) => (b.probability || 0) - (a.probability || 0));

  const getColor = (prob: number) => {
    if (prob >= 0.7) return 'bg-green-500';
    if (prob >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = (prob: number) => {
    if (prob >= 0.7) return 'text-green-600';
    if (prob >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">入选概率分布</h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedProjects.map((project, idx) => (
          <div key={project.id} className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-6">{idx + 1}</span>
            <span className="text-sm font-medium text-gray-700 w-20 truncate" title={project.name}>
              {project.name}
            </span>
            <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
              <div
                className={`h-full rounded transition-all duration-300 ${getColor(project.probability || 0)}`}
                style={{ width: `${(project.probability || 0) * 100}%` }}
              />
            </div>
            <span className={`text-sm font-medium w-12 text-right ${getTextColor(project.probability || 0)}`}>
              {((project.probability || 0) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-xs text-gray-500">高概率 (≥70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500" />
          <span className="text-xs text-gray-500">中等 (40-70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-xs text-gray-500">低概率 (&lt;40%)</span>
        </div>
      </div>
    </div>
  );
}