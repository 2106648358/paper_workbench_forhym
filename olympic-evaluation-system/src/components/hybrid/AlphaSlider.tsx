interface AlphaSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function AlphaSlider({ value, onChange }: AlphaSliderProps) {
  return (
    <div 
      className="rounded-xl p-6"
      style={{ 
        backgroundColor: '#faf9f5', 
        border: '1px solid #f0eee6',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 24px'
      }}
    >
      <h3 className="text-lg font-semibold font-serif mb-4" style={{ color: '#141413' }}>
        混合权重参数 α
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm" style={{ color: '#5e5d59' }}>
          <span>纯 EWM (α = 0)</span>
          <span className="font-medium" style={{ color: '#c96442' }}>α = {value.toFixed(2)}</span>
          <span>纯 AHP (α = 1)</span>
        </div>
        
        <div className="relative">
          <div 
            className="absolute top-1/2 left-0 right-0 h-1 rounded-full -translate-y-1/2"
            style={{ backgroundColor: '#e8e6dc' }}
          />
          <div 
            className="absolute top-1/2 left-0 h-1 rounded-full -translate-y-1/2 transition-all"
            style={{ 
              backgroundColor: '#c96442',
              width: `${value * 100}%`
            }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="relative w-full h-2 appearance-none cursor-pointer bg-transparent"
            style={{
              background: 'transparent',
            }}
          />
          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #c96442;
              cursor: pointer;
              box-shadow: 0px 0px 0px 3px rgba(201, 100, 66, 0.2);
              transition: box-shadow 0.2s;
            }
            input[type="range"]::-webkit-slider-thumb:hover {
              box-shadow: 0px 0px 0px 5px rgba(201, 100, 66, 0.3);
            }
            input[type="range"]::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #c96442;
              cursor: pointer;
              border: none;
              box-shadow: 0px 0px 0px 3px rgba(201, 100, 66, 0.2);
            }
          `}</style>
        </div>
        
        <div className="flex justify-between gap-2">
          {[0, 0.25, 0.5, 0.75, 1].map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className="flex-1 py-2 text-sm rounded-lg transition-all duration-200"
              style={{
                backgroundColor: Math.abs(value - preset) < 0.01 ? '#c96442' : '#e8e6dc',
                color: Math.abs(value - preset) < 0.01 ? '#faf9f5' : '#5e5d59',
                boxShadow: Math.abs(value - preset) < 0.01 ? '0px 0px 0px 1px #c96442' : 'none',
              }}
            >
              {preset}
            </button>
          ))}
        </div>
        
        <div 
          className="p-4 rounded-xl text-sm"
          style={{ 
            backgroundColor: '#e8e6dc', 
            color: '#4d4c48',
            fontFamily: "'Inter', system-ui, sans-serif"
          }}
        >
          <strong>公式:</strong> W = α × W<sub>AHP</sub> + (1-α) × W<sub>EWM</sub>
        </div>
      </div>
    </div>
  );
}
