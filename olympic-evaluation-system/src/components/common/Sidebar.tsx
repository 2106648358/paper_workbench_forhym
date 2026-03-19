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
    ? `fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
    : 'w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0';

  return (
    <aside className={sidebarClass}>
      {/* 系统标题 */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-sm font-semibold text-gray-900">奥运项目评估与预测系统</h1>
        <p className="text-xs text-gray-400 mt-0.5">AHP-EWM</p>
      </div>
      
      {/* 导航 */}
      <nav className="p-3">
        <ul className="space-y-1">
          {steps.map((step) => (
            <li key={step.id}>
              <button
                onClick={() => onStepChange(step.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                  currentStep === step.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                      currentStep === step.id
                        ? 'bg-blue-600 text-white'
                        : currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step.id ? '✓' : step.id}
                  </span>
                  <span className="text-sm truncate">{step.name}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}