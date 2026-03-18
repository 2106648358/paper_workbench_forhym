import { useState, useMemo } from 'react';
import type { Dimension, Indicators, Project } from '@/types';
import RadarChart from './RadarChart';

interface WhatIfPanelProps {
  project: Project;
  dimensions: Dimension[];
  weights: Record<string, number>;
  existingProjects: Project[];
  onApply: (projectId: string, newIndicators: Indicators) => void;
}

export default function WhatIfPanel({
  project,
  dimensions,
  weights,
  existingProjects,
  onApply,
}: WhatIfPanelProps) {
  const [simulatedIndicators, setSimulatedIndicators] = useState<Indicators>(
    { ...project.indicators }
  );

  const calculateScore = (indicators: Indicators) => {
    return dimensions.reduce((sum, dim) => {
      return sum + (indicators[dim.id as keyof Indicators] || 0) * (weights[dim.id] || 0);
    }, 0);
  };

  const originalScore = useMemo(() => calculateScore(project.indicators), [project.indicators, weights, dimensions]);
  const simulatedScore = useMemo(() => calculateScore(simulatedIndicators), [simulatedIndicators, weights, dimensions]);

  const getPredictedRank = (score: number) => {
    const scores = existingProjects
      .filter((p) => p.score !== undefined && p.id !== project.id)
      .map((p) => p.score as number);
    scores.push(score);
    scores.sort((a, b) => b - a);
    return scores.indexOf(score) + 1;
  };

  const originalRank = project.rank || getPredictedRank(originalScore);
  const simulatedRank = getPredictedRank(simulatedScore);

  const getProbability = (score: number) => {
    const scores = existingProjects
      .filter((p) => p.score !== undefined)
      .map((p) => p.score as number);
    if (scores.length === 0) return 0.5;
    
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const std = Math.sqrt(
      scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length
    );
    
    if (std === 0) return 0.5;
    const z = (score - avg) / std;
    return Math.round((1 / (1 + Math.exp(-2 * z))) * 100) / 100;
  };

  const originalProb = project.probability || getProbability(originalScore);
  const simulatedProb = getProbability(simulatedScore);

  const handleIndicatorChange = (dimId: string, value: number) => {
    setSimulatedIndicators((prev) => ({
      ...prev,
      [dimId]: value,
    }));
  };

  const handleReset = () => {
    setSimulatedIndicators({ ...project.indicators });
  };

  const handleApply = () => {
    onApply(project.id, simulatedIndicators);
  };

  const weakDimensions = dimensions
    .map((dim) => ({
      id: dim.id,
      name: dim.name,
      value: project.indicators[dim.id as keyof Indicators] || 0,
      avg: existingProjects.reduce((sum, p) => sum + (p.indicators[dim.id as keyof Indicators] || 0), 0) / existingProjects.length,
      weight: weights[dim.id] || 0,
    }))
    .filter((d) => d.value < d.avg)
    .sort((a, b) => (b.avg - a.value) * b.weight - (a.avg - a.value) * a.weight);

  const suggestions = weakDimensions.slice(0, 3).map((d) => ({
    dimension: d.name,
    currentValue: d.value,
    suggestedValue: Math.min(1, d.avg + 0.1),
    message: `若将${d.name}从 ${d.value.toFixed(2)} 提升至 ${(d.avg + 0.1).toFixed(2)}，可显著提高评分`,
  }));

  const comparisonData = [
    { name: '当前', indicators: project.indicators },
    { name: '模拟', indicators: simulatedIndicators },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">What-If 模拟分析</h3>
        <span className="text-sm text-gray-500">{project.name}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">调整指标值</span>
            <button
              onClick={handleReset}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              重置
            </button>
          </div>
          
          {dimensions.map((dim) => {
            const original = project.indicators[dim.id as keyof Indicators] || 0;
            const simulated = simulatedIndicators[dim.id as keyof Indicators] || 0;
            const changed = Math.abs(original - simulated) > 0.01;
            
            return (
              <div key={dim.id} className={`p-2 rounded ${changed ? 'bg-blue-50' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{dim.name}</span>
                  <span className="text-sm font-medium text-blue-600">
                    {simulated.toFixed(2)}
                    {changed && <span className="text-xs text-gray-400 ml-1">(原: {original.toFixed(2)})</span>}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={simulated}
                  onChange={(e) => handleIndicatorChange(dim.id, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            );
          })}
        </div>
        
        <div className="space-y-4">
          <RadarChart data={comparisonData} dimensions={dimensions} />
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-3">模拟结果对比</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">评分</span>
                <div className="text-right">
                  <span className="font-bold text-gray-700">{simulatedScore.toFixed(3)}</span>
                  <span className={`ml-2 text-xs ${simulatedScore > originalScore ? 'text-green-600' : simulatedScore < originalScore ? 'text-red-600' : 'text-gray-400'}`}>
                    {simulatedScore > originalScore ? '+' : ''}{(simulatedScore - originalScore).toFixed(3)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">排名</span>
                <div className="text-right">
                  <span className="font-bold text-gray-700">#{simulatedRank}</span>
                  <span className={`ml-2 text-xs ${simulatedRank < originalRank ? 'text-green-600' : simulatedRank > originalRank ? 'text-red-600' : 'text-gray-400'}`}>
                    {simulatedRank < originalRank ? '↑' : simulatedRank > originalRank ? '↓' : ''} {Math.abs(simulatedRank - originalRank) || ''}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">概率</span>
                <div className="text-right">
                  <span className={`font-bold ${simulatedProb >= 0.7 ? 'text-green-600' : simulatedProb >= 0.4 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {(simulatedProb * 100).toFixed(0)}%
                  </span>
                  <span className={`ml-2 text-xs ${simulatedProb > originalProb ? 'text-green-600' : simulatedProb < originalProb ? 'text-red-600' : 'text-gray-400'}`}>
                    {simulatedProb > originalProb ? '+' : ''}{((simulatedProb - originalProb) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {suggestions.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-700 mb-2">改进建议</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {suggestions.map((s, i) => (
                  <li key={i}>• {s.message}</li>
                ))}
              </ul>
            </div>
          )}
          
          <button
            onClick={handleApply}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            应用此调整
          </button>
        </div>
      </div>
    </div>
  );
}