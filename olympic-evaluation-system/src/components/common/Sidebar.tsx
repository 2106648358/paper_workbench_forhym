interface Step {
  id: number;
  name: string;
  path: string;
}

interface SidebarProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  isOpen?: boolean;
  isMobile?: boolean;
}

export default function Sidebar({ steps, currentStep, onStepChange, isOpen = true, isMobile = false }: SidebarProps) {
  const sidebarClass = isMobile
    ? `fixed left-0 top-0 h-screen w-64 z-40 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`
    : 'w-64 h-screen fixed left-0 top-0';

  return (
    <aside 
      className={sidebarClass}
      style={{ backgroundColor: '#faf9f5', borderRight: '1px solid #f0eee6' }}
    >
      <div className="p-6" style={{ borderBottom: '1px solid #f0eee6' }}>
        <h1 className="text-lg font-semibold font-serif" style={{ color: '#141413' }}>
          奥运项目评估与预测系统
        </h1>
        <p className="text-xs mt-1" style={{ color: '#87867f' }}>AHP-EWM 混合模型</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {steps.map((step) => (
            <li key={step.id}>
              <button
                onClick={() => onStepChange(step.id)}
                className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: currentStep === step.id ? '#c96442' : 'transparent',
                  color: currentStep === step.id ? '#faf9f5' : '#5e5d59',
                }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{
                      backgroundColor: currentStep === step.id 
                        ? 'rgba(255,255,255,0.2)' 
                        : currentStep > step.id 
                        ? '#22c55e' 
                        : '#e8e6dc',
                      color: currentStep === step.id 
                        ? '#faf9f5' 
                        : currentStep > step.id 
                        ? '#ffffff' 
                        : '#5e5d59',
                    }}
                  >
                    {currentStep > step.id ? '✓' : step.id}
                  </span>
                  <span className="text-sm font-medium truncate">{step.name}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4" style={{ borderTop: '1px solid #f0eee6' }}>
        <p className="text-xs text-center" style={{ color: '#87867f' }}>
          Olympic Evaluation System
        </p>
      </div>
    </aside>
  );
}
