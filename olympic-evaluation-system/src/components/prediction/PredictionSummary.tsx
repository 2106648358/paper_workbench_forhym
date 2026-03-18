import type { Project } from '@/types';

interface PredictionSummaryProps {
  projects: Project[];
}

export default function PredictionSummary({ projects }: PredictionSummaryProps) {
  const highProbability = projects.filter((p) => (p.probability || 0) >= 0.7);
  const mediumProbability = projects.filter((p) => (p.probability || 0) >= 0.4 && (p.probability || 0) < 0.7);
  const lowProbability = projects.filter((p) => (p.probability || 0) < 0.4);

  const summaryItems = [
    { label: '高概率入选', count: highProbability.length, color: 'bg-green-500', textColor: 'text-green-600' },
    { label: '中等概率', count: mediumProbability.length, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
    { label: '可能被淘汰', count: lowProbability.length, color: 'bg-red-500', textColor: 'text-red-600' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">预测摘要</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {summaryItems.map((item) => (
          <div key={item.label} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`text-3xl font-bold ${item.textColor}`}>{item.count}</div>
            <div className="text-sm text-gray-500 mt-1">{item.label}</div>
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        {highProbability.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-600 mb-2">高概率入选项目</h4>
            <div className="flex flex-wrap gap-2">
              {highProbability.slice(0, 5).map((p) => (
                <span key={p.id} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                  {p.name}
                </span>
              ))}
              {highProbability.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                  +{highProbability.length - 5} 更多
                </span>
              )}
            </div>
          </div>
        )}
        
        {lowProbability.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-600 mb-2">可能被淘汰项目</h4>
            <div className="flex flex-wrap gap-2">
              {lowProbability.slice(0, 5).map((p) => (
                <span key={p.id} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                  {p.name}
                </span>
              ))}
              {lowProbability.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                  +{lowProbability.length - 5} 更多
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}