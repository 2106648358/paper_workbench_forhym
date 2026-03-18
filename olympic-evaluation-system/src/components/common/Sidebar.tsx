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
    ? `fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
    : 'w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 fixed left-0 top-16';

  return (
    <aside className={sidebarClass}>
      <nav className="p-4">
        <ul className="space-y-2">
          {steps.map((step) => (
            <li key={step.id}>
              <button
                onClick={() => onStepChange(step.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  currentStep === step.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                      currentStep === step.id
                        ? 'bg-blue-600 text-white'
                        : currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step.id ? '✓' : step.id}
                  </span>
                  <span className="truncate">{step.name}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}