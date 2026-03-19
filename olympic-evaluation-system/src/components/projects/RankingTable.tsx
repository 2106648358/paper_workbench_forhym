import { useState, useMemo } from 'react';
import type { Project } from '@/types';

interface RankingTableProps {
  projects: Project[];
  selectedIds: string[];
  onSelect: (projectId: string) => void;
}

type SortField = 'rank' | 'name' | 'score' | 'probability';
type SortOrder = 'asc' | 'desc';

export default function RankingTable({ projects, selectedIds, onSelect }: RankingTableProps) {
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const sortedProjects = useMemo(() => {
    return [...projects]
      .filter((p) => p.score !== undefined)
      .sort((a, b) => {
        let aVal: string | number = 0;
        let bVal: string | number = 0;

        switch (sortField) {
          case 'rank':
            aVal = a.rank || 999;
            bVal = b.rank || 999;
            break;
          case 'name':
            aVal = a.name;
            bVal = b.name;
            break;
          case 'score':
            aVal = a.score || 0;
            bVal = b.score || 0;
            break;
          case 'probability':
            aVal = a.probability || 0;
            bVal = b.probability || 0;
            break;
        }

        if (typeof aVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
        }
        return sortOrder === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
      });
  }, [projects, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedProjects.length / pageSize);
  const paginatedProjects = sortedProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-300">↕</span>;
    return <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">项目排名</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>共 {sortedProjects.length} 项</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5条/页</option>
            <option value={10}>10条/页</option>
            <option value={20}>20条/页</option>
            <option value={50}>50条/页</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">选择</th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('rank')}
              >
                排名 <SortIcon field="rank" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                项目 <SortIcon field="name" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('score')}
              >
                综合评分 <SortIcon field="score" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('probability')}
              >
                入选概率 <SortIcon field="probability" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProjects.map((project) => (
              <tr
                key={project.id}
                className={`hover:bg-gray-50 cursor-pointer ${selectedIds.includes(project.id) ? 'bg-blue-50' : ''}`}
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
                <td className="px-4 py-3 text-sm font-medium text-gray-900">#{project.rank}</td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                    <div className="text-xs text-gray-500">{project.nameEn}</div>
                  </div>
                </td>
                <td className="px-4 py-3">{getStatusBadge(project)}</td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{project.score?.toFixed(3) || '-'}</div>
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

      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            显示 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedProjects.length)} 条，共 {sortedProjects.length} 条
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              上一页
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm border rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}