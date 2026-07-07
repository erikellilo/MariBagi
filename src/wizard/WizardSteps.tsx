import { cn } from "@/lib/cn";

interface WizardStepsProps {
  currentStep: 1 | 2 | 3;
}

export const WizardSteps = ({ currentStep }: WizardStepsProps) => {
  const steps: Array<{ num: number; label: string }> = [
    { num: 1, label: "Setup" },
    { num: 2, label: "Items" },
    { num: 3, label: "Sharing" },
  ];

  return (
    <div className="mb-6 flex items-center gap-2">
      {steps.map((step, index) => {
        const isDone = step.num < currentStep;
        const isActive = step.num === currentStep;
        return (
          <div key={step.num} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                isDone && "bg-green-500 text-white",
                isActive && "bg-blue-600 text-white",
                !isDone && !isActive && "bg-gray-200 text-gray-400"
              )}
            >
              {isDone ? "✓" : step.num}
            </div>
            <span
              className={cn(
                "text-xs",
                isActive ? "font-semibold text-blue-600" : "text-gray-400"
              )}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && <div className="mx-1 h-px flex-1 bg-gray-200" />}
          </div>
        );
      })}
    </div>
  );
};
