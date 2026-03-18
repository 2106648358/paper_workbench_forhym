import { useState, useEffect } from 'react';
import Layout from './components/common/Layout';
import JudgmentMatrix from './components/ahp/JudgmentMatrix';
import WeightsChart from './components/ahp/WeightsChart';
import RadarChart from './components/projects/RadarChart';
import RankingTable from './components/projects/RankingTable';
import AlphaSlider from './components/hybrid/AlphaSlider';
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
        return (
          <div className="space-y-6">
            <JudgmentMatrix
              matrix={judgmentMatrix}
              dimensions={config?.dimensions || []}
              editable={true}
              onChange={setJudgmentMatrix}
            />
            <WeightsChart
              weights={ahpWeights}
              dimensions={config?.dimensions || []}
              title="AHP 主观权重"
              color="#3b82f6"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">EWM 客观权重</h3>
              <p className="text-gray-600 mb-4">
                基于项目指标数据的信息熵计算，反映各指标在区分项目方面的信息量。
              </p>
            </div>
            <WeightsChart
              weights={ewmWeights}
              dimensions={config?.dimensions || []}
              title="EWM 客观权重"
              color="#22c55e"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <AlphaSlider value={alpha} onChange={setAlpha} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <WeightsChart
                weights={ahpWeights}
                dimensions={config?.dimensions || []}
                title="AHP 权重"
                color="#3b82f6"
              />
              <WeightsChart
                weights={ewmWeights}
                dimensions={config?.dimensions || []}
                title="EWM 权重"
                color="#22c55e"
              />
              <WeightsChart
                weights={hybridWeights}
                dimensions={config?.dimensions || []}
                title={`混合权重 (α=${alpha.toFixed(2)})`}
                color="#8b5cf6"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <RankingTable
              projects={projects}
              selectedIds={selectedProjects}
              onSelect={toggleProjectSelection}
            />
            {selectedProjectData.length > 0 && (
              <RadarChart
                data={selectedProjectData}
                dimensions={config?.dimensions || []}
              />
            )}
          </div>
        );
      case 5:
        const highProbability = projects.filter((p) => (p.probability || 0) >= 0.7);
        const lowProbability = projects.filter((p) => (p.probability || 0) < 0.4);
        
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">2032 年奥运项目预测</h3>
              <p className="text-gray-600">
                基于当前模型对 2032 年布里斯班奥运会项目入选概率的预测。
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-md font-semibold mb-4 text-green-600">
                  高概率入选 ({highProbability.length} 项)
                </h4>
                <ul className="space-y-2">
                  {highProbability.slice(0, 10).map((p) => (
                    <li key={p.id} className="flex justify-between items-center py-2 border-b">
                      <span>{p.name}</span>
                      <span className="text-green-600 font-medium">
                        {((p.probability || 0) * 100).toFixed(0)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-md font-semibold mb-4 text-red-600">
                  可能被淘汰 ({lowProbability.length} 项)
                </h4>
                <ul className="space-y-2">
                  {lowProbability.map((p) => (
                    <li key={p.id} className="flex justify-between items-center py-2 border-b">
                      <span>{p.name}</span>
                      <span className="text-red-600 font-medium">
                        {((p.probability || 0) * 100).toFixed(0)}%
                      </span>
                    </li>
                  ))}
                </ul>
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