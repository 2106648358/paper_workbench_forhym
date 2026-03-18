import { useMemo } from 'react';
import { calculateAHPWeights } from '@/lib';
import type { Dimension } from '@/types';

interface JudgmentMatrixProps {
  matrix: number[][];
  dimensions: Dimension[];
  editable?: boolean;
  onChange?: (matrix: number[][]) => void;
}

export default function JudgmentMatrix({
  matrix,
  dimensions,
  editable = false,
  onChange,
}: JudgmentMatrixProps) {
  const result = useMemo(() => calculateAHPWeights(matrix), [matrix]);

  const handleCellChange = (i: number, j: number, value: string) => {
    if (!editable || !onChange) return;
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;

    const newMatrix = matrix.map((row) => [...row]);
    newMatrix[i][j] = numValue;
    newMatrix[j][i] = 1 / numValue;
    onChange(newMatrix);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">判断矩阵</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 px-3 py-2 bg-gray-50"></th>
              {dimensions.map((dim) => (
                <th key={dim.id} className="border border-gray-300 px-3 py-2 bg-gray-50 text-sm">
                  {dim.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={dimensions[i].id}>
                <td className="border border-gray-300 px-3 py-2 bg-gray-50 font-medium text-sm">
                  {dimensions[i].name}
                </td>
                {row.map((cell, j) => (
                  <td key={j} className="border border-gray-300 px-3 py-2 text-center">
                    {editable && i < j ? (
                      <input
                        type="number"
                        step="0.001"
                        value={cell.toFixed(3)}
                        onChange={(e) => handleCellChange(i, j, e.target.value)}
                        className="w-20 text-center border rounded px-2 py-1"
                      />
                    ) : (
                      <span className="text-sm">{cell.toFixed(3)}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">一致性检验:</span>
          <span className={`text-sm font-medium ${result.consistency?.passed ? 'text-green-600' : 'text-red-600'}`}>
            CR = {result.consistency?.CR} {result.consistency?.passed ? '✓ 通过' : '✗ 未通过'}
          </span>
          <span className="text-sm text-gray-500">λ_max = {result.consistency?.lambdaMax}</span>
          <span className="text-sm text-gray-500">CI = {result.consistency?.CI}</span>
        </div>
      </div>
    </div>
  );
}