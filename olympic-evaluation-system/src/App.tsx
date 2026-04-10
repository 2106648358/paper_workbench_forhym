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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f4ed' }}>
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: '#c96442' }}
          />
          <p className="mt-4" style={{ color: '#5e5d59' }}>加载中...</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div 
              className="rounded-xl p-5"
              style={{ 
                backgroundColor: '#faf9f5', 
                border: '1px solid #f0eee6',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
              }}
            >
              <div className="flex border-b-0 rounded-xl overflow-hidden" style={{ border: '1px solid #f0eee6' }}>
                {[
                  { id: 'ahp', label: 'AHP 主观权重' },
                  { id: 'ewm', label: 'EWM 客观权重' },
                  { id: 'hybrid', label: '混合权重' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setWeightTab(tab.id as typeof weightTab)}
                    className="flex-1 px-4 py-3 text-sm font-medium transition-all"
                    style={{
                      backgroundColor: weightTab === tab.id ? '#c96442' : 'transparent',
                      color: weightTab === tab.id ? '#faf9f5' : '#5e5d59',
                      borderBottom: weightTab === tab.id ? '2px solid #c96442' : '2px solid transparent',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            {renderWeightContent()}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div 
              className="rounded-xl p-5"
              style={{ 
                backgroundColor: '#faf9f5', 
                border: '1px solid #f0eee6',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
              }}
            >
              <h2 className="text-lg font-semibold font-serif" style={{ color: '#141413' }}>
                项目综合评估
              </h2>
              <p className="text-sm mt-1" style={{ color: '#5e5d59' }}>
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
                  <div 
                    className="rounded-xl p-6 h-full flex items-center justify-center min-h-[300px]"
                    style={{ 
                      backgroundColor: '#faf9f5', 
                      border: '1px solid #f0eee6',
                    }}
                  >
                    <p className="text-sm" style={{ color: '#87867f' }}>请在左侧表格中选择项目查看雷达图</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 3: {
        const highProbability = projects.filter((p) => (p.probability || 0) >= 0.7);
        const mediumProbability = projects.filter((p) => (p.probability || 0) >= 0.4 && (p.probability || 0) < 0.7);
        const lowProbability = projects.filter((p) => (p.probability || 0) < 0.4);
        const sortedByProbability = [...projects].sort((a, b) => (b.probability || 0) - (a.probability || 0));

        return (
          <div className="space-y-6">
            <div 
              className="rounded-xl p-5"
              style={{ 
                backgroundColor: '#faf9f5', 
                border: '1px solid #f0eee6',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
              }}
            >
              <h2 className="text-lg font-semibold font-serif" style={{ color: '#141413' }}>
                2032 年奥运项目预测
              </h2>
              <p className="text-sm mt-1" style={{ color: '#5e5d59' }}>
                基于 AHP-EWM 混合模型的入选概率预测，共 {projects.length} 个项目
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div 
                className="rounded-xl p-4 text-center"
                style={{ backgroundColor: '#faf9f5', border: '1px solid #f0eee6' }}
              >
                <div className="text-2xl font-bold" style={{ color: '#16a34a' }}>{highProbability.length}</div>
                <div className="text-xs mt-1" style={{ color: '#5e5d59' }}>高概率 (≥70%)</div>
              </div>
              <div 
                className="rounded-xl p-4 text-center"
                style={{ backgroundColor: '#faf9f5', border: '1px solid #f0eee6' }}
              >
                <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{mediumProbability.length}</div>
                <div className="text-xs mt-1" style={{ color: '#5e5d59' }}>中等 (40-70%)</div>
              </div>
              <div 
                className="rounded-xl p-4 text-center"
                style={{ backgroundColor: '#faf9f5', border: '1px solid #f0eee6' }}
              >
                <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>{lowProbability.length}</div>
                <div className="text-xs mt-1" style={{ color: '#5e5d59' }}>可能淘汰 (&lt;40%)</div>
              </div>
            </div>

            <div 
              className="rounded-xl overflow-hidden"
              style={{ 
                backgroundColor: '#faf9f5', 
                border: '1px solid #f0eee6',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
              }}
            >
              <div 
                className="px-4 py-3"
                style={{ borderBottom: '1px solid #f0eee6' }}
              >
                <h3 className="text-sm font-semibold" style={{ color: '#141413' }}>预测结果 ({projects.length} 项)</h3>
              </div>
              <div className="overflow-x-auto max-h-80">
                <table className="min-w-full text-xs">
                  <thead className="sticky top-0" style={{ backgroundColor: '#e8e6dc' }}>
                    <tr>
                      <th className="px-3 py-2 text-left font-medium" style={{ color: '#5e5d59' }}>#</th>
                      <th className="px-3 py-2 text-left font-medium" style={{ color: '#5e5d59' }}>项目</th>
                      <th className="px-3 py-2 text-left font-medium" style={{ color: '#5e5d59' }}>状态</th>
                      <th className="px-3 py-2 text-left font-medium" style={{ color: '#5e5d59' }}>评分</th>
                      <th className="px-3 py-2 text-left font-medium" style={{ color: '#5e5d59' }}>概率</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: '#f0eee6' }}>
                    {sortedByProbability.map((p) => {
                      const prob = p.probability || 0;
                      const probColor = prob >= 0.7 ? '#16a34a' : prob >= 0.4 ? '#f59e0b' : '#ef4444';
                      return (
                        <tr 
                          key={p.id} 
                          className="hover:bg-gray-50 transition-colors"
                          style={{ borderColor: '#f0eee6' }}
                        >
                          <td className="px-3 py-2 font-medium" style={{ color: '#141413' }}>{p.rank}</td>
                          <td className="px-3 py-2" style={{ color: '#141413' }}>{p.name}</td>
                          <td className="px-3 py-2">
                            {p.yearRemoved ? (
                              <span 
                                className="px-1.5 py-0.5 rounded text-[10px]"
                                style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                              >
                                已移除
                              </span>
                            ) : p.yearAdded === null ? (
                              <span 
                                className="px-1.5 py-0.5 rounded text-[10px]"
                                style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}
                              >
                                候选
                              </span>
                            ) : p.yearAdded && p.yearAdded >= 2020 ? (
                              <span 
                                className="px-1.5 py-0.5 rounded text-[10px]"
                                style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
                              >
                                新增
                              </span>
                            ) : (
                              <span 
                                className="px-1.5 py-0.5 rounded text-[10px]"
                                style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}
                              >
                                核心
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2" style={{ color: '#141413' }}>{p.score?.toFixed(3) || '-'}</td>
                          <td className="px-3 py-2 font-medium" style={{ color: probColor }}>
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
      }
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
