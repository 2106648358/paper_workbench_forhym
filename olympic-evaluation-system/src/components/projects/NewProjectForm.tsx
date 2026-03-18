import { useState, useMemo } from 'react';
import type { Dimension, Indicators, Project } from '@/types';
import RadarChart from './RadarChart';

interface NewProjectFormProps {
  dimensions: Dimension[];
  weights: Record<string, number>;
  existingProjects: Project[];
  onAddProject: (project: Project) => void;
}

const defaultIndicators: Indicators = {
  popularity: 0.5,
  gender_equity: 0.5,
  sustainability: 0.5,
  inclusivity: 0.5,
  innovation: 0.5,
  safety: 0.5,
};

export default function NewProjectForm({
  dimensions,
  weights,
  existingProjects,
  onAddProject,
}: NewProjectFormProps) {
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [indicators, setIndicators] = useState<Indicators>(defaultIndicators);
  const [showResult, setShowResult] = useState(false);

  const handleIndicatorChange = (dimId: string, value: number) => {
    setIndicators((prev) => ({
      ...prev,
      [dimId]: value,
    }));
  };

  const calculatedScore = useMemo(() => {
    return dimensions.reduce((sum, dim) => {
      return sum + (indicators[dim.id as keyof Indicators] || 0) * (weights[dim.id] || 0);
    }, 0);
  }, [indicators, weights, dimensions]);

  const predictedRank = useMemo(() => {
    const scores = existingProjects
      .filter((p) => p.score !== undefined)
      .map((p) => p.score as number);
    scores.push(calculatedScore);
    scores.sort((a, b) => b - a);
    return scores.indexOf(calculatedScore) + 1;
  }, [calculatedScore, existingProjects]);

  const probability = useMemo(() => {
    const scores = existingProjects
      .filter((p) => p.score !== undefined)
      .map((p) => p.score as number);
    if (scores.length === 0) return 0.5;
    
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const std = Math.sqrt(
      scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length
    );
    
    if (std === 0) return 0.5;
    const z = (calculatedScore - avg) / std;
    return Math.round((1 / (1 + Math.exp(-2 * z))) * 100) / 100;
  }, [calculatedScore, existingProjects]);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('请输入项目名称');
      return;
    }

    const newProject: Project = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      nameEn: nameEn.trim() || name.trim(),
      yearAdded: null,
      indicators: { ...indicators },
      score: calculatedScore,
      rank: predictedRank,
      probability,
    };

    onAddProject(newProject);
    setName('');
    setNameEn('');
    setIndicators(defaultIndicators);
    setShowResult(false);
  };

  const previewData = [
    { name: name || '新项目', indicators },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">添加新项目</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              项目名称 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：电子竞技"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              英文名称
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="例如：Esports"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              六维指标
            </label>
            {dimensions.map((dim) => (
              <div key={dim.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{dim.name}</span>
                  <span className="text-sm font-medium text-blue-600">
                    {(indicators[dim.id as keyof Indicators] || 0).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={indicators[dim.id as keyof Indicators] || 0}
                  onChange={(e) => handleIndicatorChange(dim.id, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <RadarChart data={previewData} dimensions={dimensions} />
          </div>
          
          {showResult && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">计算评分</span>
                <span className="font-bold text-blue-600">{calculatedScore.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">预测排名</span>
                <span className="font-bold text-gray-700">#{predictedRank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">入选概率</span>
                <span className={`font-bold ${probability >= 0.7 ? 'text-green-600' : probability >= 0.4 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {(probability * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setShowResult(true)}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          计算评分
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          添加到候选列表
        </button>
      </div>
    </div>
  );
}