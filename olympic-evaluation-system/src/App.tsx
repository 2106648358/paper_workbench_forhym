import { useState, useEffect } from 'react';
import Layout from './components/common/Layout';
import JudgmentMatrix from './components/ahp/JudgmentMatrix';
import PieChart from './components/common/PieChart';
import RadarChart from './components/projects/RadarChart';
import RankingTable from './components/projects/RankingTable';
import AlphaSlider from './components/hybrid/AlphaSlider';
import EWMCalculationViewer from './components/ewm/EWMCalculationViewer';
import { useConfig, useJudgmentMatrix, useAHPWeights, useEWMWeights, useProjects } from './hooks';
import { useAppStore } from './store';
import { combineWeights, rankProjects, calculateProbability } from './lib';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [weightTab, setWeightTab] = useState<'ahp' | 'ewm' | 'hybrid'>('ahp');
  const { config, loading: configLoading } = useConfig();
  const { data: judgmentMatrixData } = useJudgmentMatrix();
  const { data: ahpWeightsData } = useAHPWeights();
  const { data: ewmWeightsData } = useEWMWeights();
  const { projects: rawProjects, loading: projectsLoading } = useProjects();

  const {
    alpha,
    setAlpha,
    judgmentMatrix,
    setJudgmentMatrix,
    ahpWeights,
    ewmWeights,
    hybridWeights,
    selectedProjects,
    toggleProjectSelection,
    setWeights,
    setProjects,
  } = useAppStore();

  useEffect(() => {
    if (ahpWeightsData?.weights) {
      setWeights('ahp', ahpWeightsData.weights);
    }
  }, [ahpWeightsData]);

  useEffect(() => {
    if (ewmWeightsData?.normalizedWeights) {
      setWeights('ewm', ewmWeightsData.normalizedWeights);
    }
  }, [ewmWeightsData]);

  useEffect(() => {
    if (judgmentMatrixData?.aggregated?.data) {
      setJudgmentMatrix(judgmentMatrixData.aggregated.data);
    }
  }, [judgmentMatrixData]);

  useEffect(() => {
    const hybrid = combineWeights(ahpWeights, ewmWeights, alpha);
    setWeights('hybrid', hybrid);
  }, [alpha, ahpWeights, ewmWeights]);

  useEffect(() => {
    if (rawProjects.length > 0 && Object.keys(hybridWeights).length > 0) {
      const ranked = rankProjects(
        rawProjects.map((p) => ({ id: p.id, name: p.name, indicators: p.indicators })),
        hybridWeights
      );

      const allScores = ranked.map((r) => r.score);
      const updatedProjects = rawProjects.map((p) => {
        const ranking = ranked.find((r) => r.id === p.id);
        return {
          ...p,
          score: ranking?.score,
          rank: ranking?.rank,
          probability: ranking ? calculateProbability(ranking.score, allScores) : undefined,
        };
      });
      setProjects(updatedProjects);
    }
  }, [rawProjects, hybridWeights]);

  const projects = useAppStore((state) => state.projects);

  const selectedProjectData = projects
    .filter((p) => selectedProjects.includes(p.id))
    .map((p) => ({ name: p.name, indicators: p.indicators }));

  const loading = configLoading || projectsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  const ahpPieData = Object.entries(ahpWeights).map(([id, value]) => {
    const dim = config?.dimensions.find((d) => d.id === id);
    return { name: dim?.name || id, value };
  });

  const ewmPieData = Object.entries(ewmWeights).map(([id, value]) => {
    const dim = config?.dimensions.find((d) => d.id === id);
    return { name: dim?.name || id, value };
  });

  const hybridPieData = Object.entries(hybridWeights).map(([id, value]) => {
    const dim = config?.dimensions.find((d) => d.id === id);
    return { name: dim?.name || id, value };
  });

  const renderWeightContent = () => {
    switch (weightTab) {
      case 'ahp':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <JudgmentMatrix
              matrix={judgmentMatrix}
              dimensions={config?.dimensions || []}
              editable={true}
              onChange={setJudgmentMatrix}
            />
            <PieChart data={ahpPieData} title="AHP 权重分布" height={300} />
          </div>
        );
      case 'ewm':
        return (
          <EWMCalculationViewer
            projects={rawProjects}
            dimensions={config?.dimensions || []}
            ewmWeights={ewmWeights}
            entropyValues={ewmWeightsData?.entropyValues || {}}
          />
        );
      case 'hybrid':
        return (
          <div className="space-y-6">
            <AlphaSlider value={alpha} onChange={setAlpha} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <PieChart data={ahpPieData} title="AHP 权重分布" height={260} />
              <PieChart data={ewmPieData} title="EWM 权重分布" height={260} />
              <PieChart data={hybridPieData} title={`混合权重 (α=${alpha.toFixed(2)})`} height={260} />
            </div>
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            {/* 子标签 */}
            <div className="bg-white rounded-lg shadow">
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'ahp', label: 'AHP 主观权重' },
                  { id: 'ewm', label: 'EWM 客观权重' },
                  { id: 'hybrid', label: '混合权重' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setWeightTab(tab.id as typeof weightTab)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      weightTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            {/* 内容 */}
            {renderWeightContent()}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-800">项目综合评估</h2>
              <p className="text-sm text-gray-500 mt-1">
                基于六维指标体系对奥运项目进行综合评分与排名
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RankingTable
                projects={projects}
                selectedIds={selectedProjects}
                onSelect={toggleProjectSelection}
              />
              <div>
                {selectedProjectData.length > 0 ? (
                  <RadarChart
                    data={selectedProjectData}
                    dimensions={config?.dimensions || []}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow p-6 h-full flex items-center justify-center min-h-[300px]">
                    <p className="text-gray-400">请在左侧表格中选择项目查看雷达图</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 3:
        const highProbability = projects.filter((p) => (p.probability || 0) >= 0.7);
        const mediumProbability = projects.filter((p) => (p.probability || 0) >= 0.4 && (p.probability || 0) < 0.7);
        const lowProbability = projects.filter((p) => (p.probability || 0) < 0.4);
        const sortedByProbability = [...projects].sort((a, b) => (b.probability || 0) - (a.probability || 0));

        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-800">2032 年奥运项目预测</h2>
              <p className="text-sm text-gray-500 mt-1">
                基于 AHP-EWM 混合模型的入选概率预测，共 {projects.length} 个项目
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{highProbability.length}</div>
                <div className="text-xs text-gray-500 mt-1">高概率 (≥70%)</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{mediumProbability.length}</div>
                <div className="text-xs text-gray-500 mt-1">中等 (40-70%)</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{lowProbability.length}</div>
                <div className="text-xs text-gray-500 mt-1">可能淘汰 (&lt;40%)</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold">预测结果 ({projects.length} 项)</h3>
              </div>
              <div className="overflow-x-auto max-h-80">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-500">#</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500">项目</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500">状态</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500">评分</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500">概率</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sortedByProbability.map((p) => {
                      const prob = p.probability || 0;
                      const probColor = prob >= 0.7 ? 'text-green-600' : prob >= 0.4 ? 'text-yellow-600' : 'text-red-600';
                      return (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium">{p.rank}</td>
                          <td className="px-3 py-2">{p.name}</td>
                          <td className="px-3 py-2">
                            {p.yearRemoved ? (
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px]">已移除</span>
                            ) : p.yearAdded === null ? (
                              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px]">候选</span>
                            ) : p.yearAdded && p.yearAdded >= 2020 ? (
                              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px]">新增</span>
                            ) : (
                              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px]">核心</span>
                            )}
                          </td>
                          <td className="px-3 py-2">{p.score?.toFixed(3) || '-'}</td>
                          <td className={`px-3 py-2 font-medium ${probColor}`}>
                            {(prob * 100).toFixed(0)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout currentStep={currentStep} onStepChange={setCurrentStep}>
      {renderContent()}
    </Layout>
  );
}

export default App;