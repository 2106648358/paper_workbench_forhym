import type { Dimension } from '@/types';

interface ExpertComparisonProps {
  experts: { id: string; name: string; background: string }[];
  matrices: Record<string, { data: number[][]; CR: number }>;
  dimensions: Dimension[];
}

export default function ExpertComparison({ experts, matrices, dimensions }: ExpertComparisonProps) {
  const getWeights = (matrix: number[][]): number[] => {
    const n = matrix.length;
    let v = new Array(n).fill(1 / n);
    
    for (let iter = 0; iter < 100; iter++) {
      const newV = matrix.map((row) =>
        row.reduce((sum, val, j) => sum + val * v[j], 0)
      );
      const norm = Math.sqrt(newV.reduce((sum, val) => sum + val * val, 0));
      v = newV.map((x) => x / (norm || 1));
    }
    
    const sum = v.reduce((a, b) => a + b, 0);
    return v.map((x) => x / (sum || 1));
  };

  const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">多专家权重对比</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">专家</th>
              {dimensions.map((dim) => (
                <th key={dim.id} className="text-center py-2 px-3 text-sm font-medium text-gray-500">
                  {dim.name}
                </th>
              ))}
              <th className="text-center py-2 px-3 text-sm font-medium text-gray-500">CR</th>
            </tr>
          </thead>
          <tbody>
            {experts.map((expert, idx) => {
              const matrix = matrices[expert.id];
              if (!matrix) return null;
              
              const weights = getWeights(matrix.data);
              
              return (
                <tr key={expert.id} className="border-t">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[idx % colors.length] }}
                      />
                      <span className="text-sm">{expert.name}</span>
                    </div>
                  </td>
                  {weights.map((w, i) => (
                    <td key={i} className="text-center py-2 px-3 text-sm">
                      {(w * 100).toFixed(1)}%
                    </td>
                  ))}
                  <td className="text-center py-2 px-3">
                    <span className={`text-sm ${matrix.CR < 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                      {matrix.CR.toFixed(4)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}