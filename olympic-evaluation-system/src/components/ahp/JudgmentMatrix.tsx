import { useMemo } from 'react';
import { calculateAHPWeights } from '@/lib';
import type { Dimension } from '@/types';

interface JudgmentMatrixProps {
  matrix: number[][];
  dimensions: Dimension[];
  editable?: boolean;
  onChange?: (matrix: number[][]) => void;
}

const DIMENSION_COLORS: string[] = [
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#8b5cf6',
  '#f97316',
  '#ef4444',
];

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

  const getColor = (index: number) => DIMENSION_COLORS[index % DIMENSION_COLORS.length];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="overflow-x-auto">
        <table className="border-collapse text-xs mx-auto">
          <thead>
            <tr>
              <th className="w-6"></th>
              {dimensions.map((dim, i) => (
                <th key={dim.id} className="px-1 py-1 text-center" title={dim.name}>
                  <div
                    className="w-3 h-3 rounded-full mx-auto"
                    style={{ backgroundColor: getColor(i) }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={dimensions[i].id}>
                <td className="py-0.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getColor(i) }}
                    title={dimensions[i].name}
                  />
                </td>
                {row.map((cell, j) => {
                  const isEditable = editable && i < j;
                  const isDiagonal = i === j;
                  return (
                    <td
                      key={j}
                      className={`px-1 py-0.5 text-center border ${
                        isDiagonal ? 'bg-gray-100' : 'bg-white'
                      }`}
                    >
                      {isEditable ? (
                        <input
                          type="number"
                          step="0.01"
                          value={cell.toFixed(2)}
                          onChange={(e) => handleCellChange(i, j, e.target.value)}
                          className="w-10 text-center border rounded px-0.5 py-0.5 text-[10px]"
                        />
                      ) : (
                        <span className="text-gray-600 tabular-nums">{cell.toFixed(2)}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`mt-2 px-2 py-1 rounded text-[10px] text-center ${
        result.consistency?.passed ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
      }`}>
        CR={result.consistency?.CR?.toFixed(4)} {result.consistency?.passed ? '✓' : '✗'}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-500 justify-center">
        {dimensions.map((dim, i) => (
          <div key={dim.id} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getColor(i) }}
            />
            <span>{dim.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}