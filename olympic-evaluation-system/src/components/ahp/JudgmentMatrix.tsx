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
  '#c96442',
  '#d97757',
  '#5e5d59',
  '#87867f',
  '#4d4c48',
  '#3d3d3a',
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
    <div 
      className="rounded-xl p-5"
      style={{ 
        backgroundColor: '#faf9f5', 
        border: '1px solid #f0eee6',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
      }}
    >
      <div className="overflow-x-auto">
        <table className="border-collapse text-xs mx-auto">
          <thead>
            <tr>
              <th className="w-6"></th>
              {dimensions.map((dim, i) => (
                <th key={dim.id} className="px-2 py-2 text-center" title={dim.name}>
                  <div
                    className="w-4 h-4 rounded-full mx-auto"
                    style={{ backgroundColor: getColor(i) }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={dimensions[i].id}>
                <td className="py-1">
                  <div
                    className="w-4 h-4 rounded-full"
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
                      className="px-1 py-1 text-center"
                      style={{
                        backgroundColor: isDiagonal ? '#e8e6dc' : '#faf9f5',
                        border: '1px solid #f0eee6',
                      }}
                    >
                      {isEditable ? (
                        <input
                          type="number"
                          step="0.01"
                          value={cell.toFixed(2)}
                          onChange={(e) => handleCellChange(i, j, e.target.value)}
                          className="w-12 text-center rounded-lg px-1 py-1 text-[10px]"
                          style={{
                            backgroundColor: '#faf9f5',
                            border: '1px solid #f0eee6',
                            color: '#141413',
                          }}
                        />
                      ) : (
                        <span className="tabular-nums" style={{ color: '#5e5d59' }}>
                          {cell.toFixed(2)}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div 
        className="mt-3 px-3 py-2 rounded-lg text-xs text-center font-medium"
        style={{
          backgroundColor: result.consistency?.passed ? '#22c55e' : '#ef4444',
          color: '#ffffff',
        }}
      >
        CR = {result.consistency?.CR?.toFixed(4)} {result.consistency?.passed ? '✓ 一致性检验通过' : '✗ 需要调整'}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] justify-center" style={{ color: '#87867f' }}>
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
