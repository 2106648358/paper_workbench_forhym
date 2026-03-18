import { useState } from 'react';
import type { SavedScheme } from '@/types';

interface SchemeManagerProps {
  schemes: SavedScheme[];
  currentAlpha: number;
  currentSelectedProjects: string[];
  onSave: (name: string) => void;
  onLoad: (schemeId: string) => void;
  onDelete: (schemeId: string) => void;
  onCompare: (schemeIds: string[]) => void;
}

export default function SchemeManager({
  schemes,
  currentAlpha,
  currentSelectedProjects,
  onSave,
  onLoad,
  onDelete,
  onCompare,
}: SchemeManagerProps) {
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [schemeName, setSchemeName] = useState('');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const handleSave = () => {
    if (!schemeName.trim()) return;
    onSave(schemeName.trim());
    setSchemeName('');
    setShowSaveForm(false);
  };

  const toggleCompareSelection = (schemeId: string) => {
    setSelectedForCompare((prev) =>
      prev.includes(schemeId)
        ? prev.filter((id) => id !== schemeId)
        : prev.length < 3
        ? [...prev, schemeId]
        : prev
    );
  };

  const handleCompare = () => {
    if (selectedForCompare.length >= 2) {
      onCompare(selectedForCompare);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">方案管理</h3>
        <button
          onClick={() => setShowSaveForm(!showSaveForm)}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          保存当前方案
        </button>
      </div>
      
      {showSaveForm && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={schemeName}
              onChange={(e) => setSchemeName(e.target.value)}
              placeholder="输入方案名称"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              保存
            </button>
            <button
              onClick={() => setShowSaveForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              取消
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            当前配置: α={currentAlpha.toFixed(2)}, 选中 {currentSelectedProjects.length} 个项目
          </p>
        </div>
      )}
      
      {schemes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">暂无保存的方案</p>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                className={`p-3 border rounded-lg ${
                  selectedForCompare.includes(scheme.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedForCompare.includes(scheme.id)}
                      onChange={() => toggleCompareSelection(scheme.id)}
                      className="rounded border-gray-300"
                    />
                    <span className="font-medium">{scheme.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onLoad(scheme.id)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      加载
                    </button>
                    <button
                      onClick={() => onDelete(scheme.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      删除
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  α={scheme.alpha.toFixed(2)} | {new Date(scheme.createdAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
            ))}
          </div>
          
          {selectedForCompare.length >= 2 && (
            <button
              onClick={handleCompare}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              对比选中方案 ({selectedForCompare.length})
            </button>
          )}
        </>
      )}
    </div>
  );
}

interface SchemeComparisonProps {
  schemes: SavedScheme[];
  onClose: () => void;
}

export function SchemeComparison({ schemes, onClose }: SchemeComparisonProps) {
  if (schemes.length < 2) return null;

  const dimensionIds = ['popularity', 'gender_equity', 'sustainability', 'inclusivity', 'innovation', 'safety'];
  const dimensionNames: Record<string, string> = {
    popularity: '流行度',
    gender_equity: '性别平等',
    sustainability: '可持续性',
    inclusivity: '包容性',
    innovation: '创新性',
    safety: '安全性',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">方案对比</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">指标</th>
              {schemes.map((s) => (
                <th key={s.id} className="text-center py-2 px-3 text-sm font-medium">
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="py-2 px-3 text-sm font-medium text-gray-700">α 参数</td>
              {schemes.map((s) => (
                <td key={s.id} className="text-center py-2 px-3 text-sm">
                  {s.alpha.toFixed(2)}
                </td>
              ))}
            </tr>
            {dimensionIds.map((dimId) => (
              <tr key={dimId} className="border-t">
                <td className="py-2 px-3 text-sm text-gray-600">{dimensionNames[dimId]}</td>
                {schemes.map((s) => {
                  const weight = s.weights[dimId] || 0;
                  const maxWeight = Math.max(...schemes.map((s) => s.weights[dimId] || 0));
                  const isMax = weight === maxWeight;
                  return (
                    <td key={s.id} className={`text-center py-2 px-3 text-sm ${isMax ? 'font-bold text-blue-600' : ''}`}>
                      {(weight * 100).toFixed(1)}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}