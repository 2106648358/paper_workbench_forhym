interface CalculationProgressProps {
  steps: { id: string; label: string }[];
  currentStep: string | null;
  isCalculating: boolean;
}

export default function CalculationProgress({
  steps,
  currentStep,
  isCalculating,
}: CalculationProgressProps) {
  if (!isCalculating && !currentStep) return null;

  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
        <span className="text-sm font-medium text-blue-700">
          {currentStep ? `正在计算: ${steps.find((s) => s.id === currentStep)?.label || ''}` : '计算中...'}
        </span>
      </div>
      <div className="flex gap-1">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isComplete = steps.findIndex((s) => s.id === currentStep) > index;

          return (
            <div
              key={step.id}
              className="flex-1 flex items-center gap-1"
            >
              <div
                className={`w-full h-1.5 rounded-full transition-colors ${
                  isActive ? 'bg-blue-600' : isComplete ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
              {index < steps.length - 1 && (
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isComplete ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {steps.map((step) => (
          <span
            key={step.id}
            className={`${currentStep === step.id ? 'text-blue-600 font-medium' : ''}`}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
}