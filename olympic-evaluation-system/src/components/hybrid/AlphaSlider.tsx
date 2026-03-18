interface AlphaSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function AlphaSlider({ value, onChange }: AlphaSliderProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">混合权重参数 α</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>纯 EWM (α = 0)</span>
          <span className="font-medium text-blue-600">α = {value.toFixed(2)}</span>
          <span>纯 AHP (α = 1)</span>
        </div>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        
        <div className="flex justify-between gap-2">
          {[0, 0.25, 0.5, 0.75, 1].map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                Math.abs(value - preset) < 0.01
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <strong>公式:</strong> W = α × W<sub>AHP</sub> + (1-α) × W<sub>EWM</sub>
        </div>
      </div>
    </div>
  );
}