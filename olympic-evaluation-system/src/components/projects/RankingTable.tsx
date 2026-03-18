import type { Project } from '@/types';

interface RankingTableProps {
  projects: Project[];
  selectedIds: string[];
  onSelect: (projectId: string) => void;
}

export default function RankingTable({ projects, selectedIds, onSelect }: RankingTableProps) {
  const sortedProjects = [...projects]
    .filter((p) => p.score !== undefined)
    .sort((a, b) => (a.rank || 999) - (b.rank || 999));

  const getProbabilityColor = (prob: number | undefined) => {
    if (!prob) return 'text-gray-400';
    if (prob >= 0.7) return 'text-green-600';
    if (prob >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (project: Project) => {
    if (project.yearRemoved) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">已移除</span>;
    }
    if (project.yearAdded === null) {
      return <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">候选</span>;
    }
    if (project.yearAdded && project.yearAdded >= 2020) {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">新增</span>;
    }
    return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">核心</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">项目排名</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                选择
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                排名
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                项目
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                状态
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                综合评分
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                入选概率
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProjects.map((project) => (
              <tr
                key={project.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedIds.includes(project.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => onSelect(project.id)}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(project.id)}
                    onChange={() => onSelect(project.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  #{project.rank}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                    <div className="text-xs text-gray-500">{project.nameEn}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(project)}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    {project.score?.toFixed(3) || '-'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-medium ${getProbabilityColor(project.probability)}`}>
                    {project.probability ? `${(project.probability * 100).toFixed(0)}%` : '-'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}