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

  // 初始化 AHP 权重
  useEffect(() => {
    if (ahpWeightsData?.weights) {
      setWeights('ahp', ahpWeightsData.weights);
    }
  }, [ahpWeightsData]);

  // 初始化 EWM 权重
  useEffect(() => {
    if (ewmWeightsData?.normalizedWeights) {
      setWeights('ewm', ewmWeightsData.normalizedWeights);
    }
  }, [ewmWeightsData]);

  // 初始化判断矩阵
  useEffect(() => {
    if (judgmentMatrixData?.aggregated?.data) {
      setJudgmentMatrix(judgmentMatrixData.aggregated.data);
    }
  }, [judgmentMatrixData]);

  // 计算混合权重
  useEffect(() => {
    const hybrid = combineWeights(ahpWeights, ewmWeights, alpha);
    setWeights('hybrid', hybrid);
  }, [alpha, ahpWeights, ewmWeights]);

  // 计算项目评分和排名
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

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        const ahpPieData = Object.entries(ahpWeights).map(([id, value]) => {
          const dim = config?.dimensions.find((d) => d.id === id);
          return { name: dim?.name || id, value };
        });
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold text-gray-800">AHP 权重分析</h2>
              <p className="text-sm text-gray-500 mt-1">层次分析法（AHP）通过专家判断矩阵计算各指标的主观权重</p>
            </div>
            <JudgmentMatrix
              matrix={judgmentMatrix}
              dimensions={config?.dimensions || []}
              editable={true}
              onChange={setJudgmentMatrix}
            />
            <PieChart data={ahpPieData} title="AHP 权重分布" height={320} />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold text-gray-800">EWM 熵权分析</h2>
              <p className="text-sm text-gray-500 mt-1">熵权法（EWM）基于数据的信息熵计算各指标的客观权重</p>
            </div>
            <EWMCalculationViewer
              projects={rawProjects}
              dimensions={config?.dimensions || []}
              ewmWeights={ewmWeights}
              entropyValues={ewmWeightsData?.entropyValues || {}}
            />
          </div>
        );
      case 3:
        const ahpPieData2 = Object.entries(ahpWeights).map(([id, value]) => {
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
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold text-gray-800">混合权重组合</h2>
              <p className="text-sm text-gray-500 mt-1">
                通过参数 α 调整主观权重（AHP）和客观权重（EWM）的组合比例
              </p>
            </div>
            <AlphaSlider value={alpha} onChange={setAlpha} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <PieChart data={ahpPieData2} title="AHP 权重分布" height={280} />
              <PieChart data={ewmPieData} title="EWM 权重分布" height={280} />
              <PieChart data={hybridPieData} title={`混合权重分布 (α=${alpha.toFixed(2)})`} height={280} />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold text-gray-800">项目综合评估</h2>
              <p className="text-sm text-gray-500 mt-1">
                基于六维指标体系对奥运项目进行综合评分与排名，支持多项目对比分析
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <RankingTable
                  projects={projects}
                  selectedIds={selectedProjects}
                  onSelect={toggleProjectSelection}
                />
              </div>
              <div>
                {selectedProjectData.length > 0 ? (
                  <RadarChart
                    data={selectedProjectData}
                    dimensions={config?.dimensions || []}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow p-6 h-full flex items-center justify-center">
                    <p className="text-gray-400">请在左侧表格中选择项目以查看六维雷达图</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 5:
        const highProbability = projects.filter((p) => (p.probability || 0) >= 0.7);
        const mediumProbability = projects.filter((p) => (p.probability || 0) >= 0.4 && (p.probability || 0) < 0.7);
        const lowProbability = projects.filter((p) => (p.probability || 0) < 0.4);
        const sortedByProbability = [...projects].sort((a, b) => (b.probability || 0) - (a.probability || 0));

        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800">2032 年奥运项目入选预测</h2>
              <p className="text-gray-600 mt-2">
                基于当前 AHP-EWM 混合模型对 2032 年布里斯班奥运会项目入选概率的预测。
                共计 {projects.length} 个项目参与评估。
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{highProbability.length}</div>
                <div className="text-sm text-gray-500 mt-1">高概率入选 (≥70%)</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-yellow-600">{mediumProbability.length}</div>
                <div className="text-sm text-gray-500 mt-1">中等概率 (40-70%)</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-600">{lowProbability.length}</div>
                <div className="text-sm text-gray-500 mt-1">可能被淘汰 (&lt;40%)</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">全部项目预测结果 ({projects.length} 项)</h3>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">排名</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">项目</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">评分</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">入选概率</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedByProbability.map((p) => {
                      const prob = p.probability || 0;
                      const probColor = prob >= 0.7 ? 'text-green-600' : prob >= 0.4 ? 'text-yellow-600' : 'text-red-600';
                      const bgHighlight = prob >= 0.7 ? 'bg-green-50' : prob >= 0.4 ? '' : 'bg-red-50';
                      return (
                        <tr key={p.id} className={`hover:bg-gray-50 ${bgHighlight}`}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">#{p.rank}</td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.nameEn}</div>
                          </td>
                          <td className="px-4 py-3">
                            {p.yearRemoved ? (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">已移除</span>
                            ) : p.yearAdded === null ? (
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">候选</span>
                            ) : p.yearAdded && p.yearAdded >= 2020 ? (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">新增</span>
                            ) : (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">核心</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{p.score?.toFixed(3) || '-'}</td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-medium ${probColor}`}>
                              {(prob * 100).toFixed(0)}%
                            </span>
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