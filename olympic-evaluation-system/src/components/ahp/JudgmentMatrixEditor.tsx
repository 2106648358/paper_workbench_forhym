import { useState } from 'react';
import type { Dimension } from '@/types';
import { calculateAHPWeights } from '@/lib';

interface JudgmentMatrixEditorProps {
  matrix: number[][];
  dimensions: Dimension[];
  onChange: (matrix: number[][]) => void;
}

const PRESET_MATRICES: Record<string, { name: string; matrix: number[][] }> = {
  balanced: {
    name: '均衡方案',
    matrix: [
      [1, 2.667, 3.667, 3.928, 4.718, 2.667],
      [0.375, 1, 2, 2.297, 3.301, 1.148],
      [0.273, 0.5, 1, 1.189, 2, 0.638],
      [0.255, 0.435, 0.841, 1, 1.741, 0.536],
      [0.212, 0.303, 0.5, 0.575, 1, 0.347],
      [0.375, 0.871, 1.568, 1.866, 2.884, 1],
    ],
  },
  popularityFocused: {
    name: '重视流行度',
    matrix: [
      [1, 5, 5, 5, 5, 5],
      [0.2, 1, 2, 2, 2, 2],
      [0.2, 0.5, 1, 1, 1, 1],
      [0.2, 0.5, 1, 1, 1, 1],
      [0.2, 0.5, 1, 1, 1, 1],
      [0.2, 0.5, 1, 1, 1, 1],
    ],
  },
  equityFocused: {
    name: '重视性别平等',
    matrix: [
      [1, 0.333, 2, 2, 3, 2],
      [3, 1, 5, 5, 5, 5],
      [0.5, 0.2, 1, 1, 2, 1],
      [0.5, 0.2, 1, 1, 2, 1],
      [0.333, 0.2, 0.5, 0.5, 1, 0.5],
      [0.5, 0.2, 1, 1, 2, 1],
    ],
  },
};

export default function JudgmentMatrixEditor({
  matrix,
  dimensions,
  onChange,
}: JudgmentMatrixEditorProps) {
  const [editMode, setEditMode] = useState(false);
  const [originalMatrix, setOriginalMatrix] = useState<number[][] | null>(null);

  const result = calculateAHPWeights(matrix);

  const handleCellChange = (i: number, j: number, value: string) => {
    if (!editMode) return;
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;

    const newMatrix = matrix.map((row) => [...row]);
    newMatrix[i][j] = numValue;
    newMatrix[j][i] = 1 / numValue;
    onChange(newMatrix);
  };

  const handleEditModeToggle = () => {
    if (!editMode) {
      setOriginalMatrix(matrix.map((row) => [...row]));
    }
    setEditMode(!editMode);
  };

  const handleReset = () => {
    if (originalMatrix) {
      onChange(originalMatrix);
      setOriginalMatrix(null);
    }
  };

  const handlePresetSelect = (presetKey: string) => {
    const preset = PRESET_MATRICES[presetKey];
    if (preset) {
      onChange(preset.matrix.map((row) => [...row]));
    }
  };

  const getCellHighlight = (i: number, j: number): string => {
    if (!editMode || i >= j) return '';
    if (result.consistency && !result.consistency.passed) {
      return 'bg-red-50 border-red-300';
    }
    return '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">判断矩阵编辑器</h3>
        <div className="flex items-center gap-2">
          {editMode && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              重置
            </button>
          )}
          <button
            onClick={handleEditModeToggle}
            className={`px-3 py-1.5 text-sm rounded ${
              editMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {editMode ? '完成编辑' : '编辑模式'}
          </button>
        </div>
      </div>

      {editMode && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <label className="text-sm font-medium text-gray-700 mb-2 block">预设方案</label>
          <div className="flex gap-2">
            {Object.entries(PRESET_MATRICES).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => handlePresetSelect(key)}
                className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

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
                  <td
                    key={j}
                    className={`border border-gray-300 px-3 py-2 text-center ${getCellHighlight(i, j)}`}
                  >
                    {editMode && i < j ? (
                      <input
                        type="number"
                        step="0.001"
                        min="0.001"
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

      <div className={`p-4 rounded-lg ${result.consistency?.passed ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">一致性检验:</span>
          <span
            className={`text-sm font-medium ${
              result.consistency?.passed ? 'text-green-600' : 'text-red-600'
            }`}
          >
            CR = {result.consistency?.CR} {result.consistency?.passed ? '✓ 通过' : '✗ 未通过'}
          </span>
          <span className="text-sm text-gray-500">λ_max = {result.consistency?.lambdaMax}</span>
          <span className="text-sm text-gray-500">CI = {result.consistency?.CI}</span>
        </div>
        {result.consistency && !result.consistency.passed && (
          <p className="text-sm text-red-600 mt-2">
            一致性检验未通过，请调整判断矩阵使 CR &lt; 0.1
          </p>
        )}
      </div>
    </div>
  );
}