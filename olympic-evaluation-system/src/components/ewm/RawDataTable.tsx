import type { Project, Dimension, Indicators } from '@/types';

interface RawDataTableProps {
  projects: Project[];
  dimensions: Dimension[];
}

export default function RawDataTable({ projects, dimensions }: RawDataTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">原始指标数据</h3>
        <p className="text-sm text-gray-500 mt-1">
          共 {projects.length} 个项目的六维指标原始数据
        </p>
      </div>
      
      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">
                项目
              </th>
              {dimensions.map((dim) => (
                <th key={dim.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  {dim.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 sticky left-0 bg-white">
                  {project.name}
                </td>
                {dimensions.map((dim) => (
                  <td key={dim.id} className="px-4 py-3 text-sm text-center text-gray-600">
                    {project.indicators[dim.id as keyof Indicators]?.toFixed(2) || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}