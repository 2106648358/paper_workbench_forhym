import { useState, useMemo } from 'react';
import type { Project } from '@/types';

interface RankingTableProps {
  projects: Project[];
  selectedIds: string[];
  onSelect: (projectId: string) => void;
}

type SortField = 'rank' | 'name' | 'score' | 'probability';
type SortOrder = 'asc' | 'desc';

function SortIcon({ field, sortField, sortOrder }: { field: SortField; sortField: SortField; sortOrder: SortOrder }) {
  if (sortField !== field) return <span style={{ color: '#d1cfc5' }}>↕</span>;
  return <span style={{ color: '#c96442' }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>;
}

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
    if (!prob) return '#87867f';
    if (prob >= 0.7) return '#22c55e';
    if (prob >= 0.4) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusBadge = (project: Project) => {
    if (project.yearRemoved) {
      return (
        <span 
          className="px-2 py-1 text-xs rounded-lg"
          style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
        >
          已移除
        </span>
      );
    }
    if (project.yearAdded === null) {
      return (
        <span 
          className="px-2 py-1 text-xs rounded-lg"
          style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}
        >
          候选
        </span>
      );
    }
    if (project.yearAdded && project.yearAdded >= 2020) {
      return (
        <span 
          className="px-2 py-1 text-xs rounded-lg"
          style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
        >
          新增
        </span>
      );
    }
    return (
      <span 
        className="px-2 py-1 text-xs rounded-lg"
        style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}
      >
        核心
      </span>
    );
  };

  return (
    <div 
      className="rounded-xl overflow-hidden"
      style={{ 
        backgroundColor: '#faf9f5', 
        border: '1px solid #f0eee6',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
      }}
    >
      <div 
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid #f0eee6' }}
      >
        <h3 className="text-lg font-semibold font-serif" style={{ color: '#141413' }}>项目排名</h3>
        <div className="flex items-center gap-3 text-sm" style={{ color: '#5e5d59' }}>
          <span>共 {sortedProjects.length} 项</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg px-3 py-1.5 text-sm"
            style={{
              backgroundColor: '#e8e6dc',
              border: '1px solid #f0eee6',
              color: '#4d4c48',
            }}
          >
            <option value={5}>5条/页</option>
            <option value={10}>10条/页</option>
            <option value={20}>20条/页</option>
            <option value={50}>50条/页</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr style={{ backgroundColor: '#e8e6dc' }}>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5e5d59' }}>
                选择
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('rank')}
                style={{ color: '#5e5d59' }}
              >
                排名 <SortIcon field="rank" sortField={sortField} sortOrder={sortOrder} />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
                style={{ color: '#5e5d59' }}
              >
                项目 <SortIcon field="name" sortField={sortField} sortOrder={sortOrder} />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#5e5d59' }}>
                状态
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('score')}
                style={{ color: '#5e5d59' }}
              >
                综合评分 <SortIcon field="score" sortField={sortField} sortOrder={sortOrder} />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('probability')}
                style={{ color: '#5e5d59' }}
              >
                入选概率 <SortIcon field="probability" sortField={sortField} sortOrder={sortOrder} />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.map((project) => (
              <tr
                key={project.id}
                className="cursor-pointer transition-colors"
                style={{ 
                  borderBottom: '1px solid #f0eee6',
                  backgroundColor: selectedIds.includes(project.id) ? '#fef3ee' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!selectedIds.includes(project.id)) {
                    e.currentTarget.style.backgroundColor = '#f5f4ed';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedIds.includes(project.id)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                onClick={() => onSelect(project.id)}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(project.id)}
                    onChange={() => onSelect(project.id)}
                    className="rounded"
                    style={{ accentColor: '#c96442' }}
                  />
                </td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: '#141413' }}>
                  #{project.rank}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#141413' }}>{project.name}</div>
                    <div className="text-xs" style={{ color: '#87867f' }}>{project.nameEn}</div>
                  </div>
                </td>
                <td className="px-4 py-3">{getStatusBadge(project)}</td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: '#141413' }}>
                  {project.score?.toFixed(3) || '-'}
                </td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: getProbabilityColor(project.probability) }}>
                  {project.probability ? `${(project.probability * 100).toFixed(0)}%` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div 
          className="px-6 py-3 flex items-center justify-between"
          style={{ borderTop: '1px solid #f0eee6' }}
        >
          <div className="text-sm" style={{ color: '#5e5d59' }}>
            显示 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedProjects.length)} 条，共 {sortedProjects.length} 条
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50"
              style={{ 
                backgroundColor: '#e8e6dc', 
                color: '#4d4c48',
              }}
            >
              上一页
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="px-3 py-1.5 text-sm rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: currentPage === page ? '#c96442' : '#e8e6dc',
                    color: currentPage === page ? '#faf9f5' : '#4d4c48',
                  }}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50"
              style={{ 
                backgroundColor: '#e8e6dc', 
                color: '#4d4c48',
              }}
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
