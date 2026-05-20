interface Step {
  name: string;
  label: string;
}

interface CheckoutStepsProps {
  currentStep: 1 | 2 | 3 | 4;
  steps: Step[];
}

export function CheckoutSteps({ currentStep, steps }: CheckoutStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1 as 1 | 2 | 3 | 4;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={step.name} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold text-sm ${
                    isActive
                      ? 'border-(--color-primary) bg-(--color-primary) text-(--color-surface)'
                      : isCompleted
                        ? 'border-(--color-success) bg-(--color-success) text-(--color-surface)'
                        : 'border-(--color-border) bg-(--color-surface) text-(--color-text)'
                  }`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <p className="mt-2 text-xs font-semibold text-(--color-text)">
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 flex-1 h-1 ${
                    isCompleted ? 'bg-(--color-success)' : 'bg-(--color-border)'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
