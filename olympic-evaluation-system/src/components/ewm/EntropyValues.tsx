import type { Dimension } from '@/types';

interface EntropyValuesProps {
  entropyValues: Record<string, number>;
  dimensions: Dimension[];
}

export default function EntropyValues({ entropyValues, dimensions }: EntropyValuesProps) {
  const getUtilityValue = (entropy: number) => 1 - entropy;
  
  const sortedDimensions = [...dimensions].sort((a, b) => {
    const utilityA = getUtilityValue(entropyValues[a.id] || 0);
    const utilityB = getUtilityValue(entropyValues[b.id] || 0);
    return utilityB - utilityA;
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">信息熵与效用值</h3>
      <p className="text-sm text-gray-500 mb-4">
        信息熵反映指标的差异程度，熵值越小说明指标差异越大，信息效用值越高
      </p>
      
      <div className="space-y-4">
        {sortedDimensions.map((dim) => {
          const entropy = entropyValues[dim.id] || 0;
          const utility = getUtilityValue(entropy);
          
          return (
            <div key={dim.id} className="border-b border-gray-100 pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{dim.name}</span>
                <span className="text-sm text-gray-500">
                  效用值: {utility.toFixed(3)}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-xs text-gray-400 mb-1">信息熵 H</div>
                  <div className="h-4 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded"
                      style={{ width: `${entropy * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400 mb-1">效用值 1-H</div>
                  <div className="h-4 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded"
                      style={{ width: `${utility * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-right text-xs text-gray-400 mt-1">
                H = {entropy.toFixed(3)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}