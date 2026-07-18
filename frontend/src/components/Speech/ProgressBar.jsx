import { CircleCheck, LoaderCircle, Check } from 'lucide-react';

const steps = [
  "Uploading",
  "AI Extraction",
  "Transcription",
  "Analysis",
  "Complete",
];

function ProgressBar({ step = -1, awaitingApproval = false }) {
  const fillPercent = step >= 0 ? (step / 5) * 80 : 0;

  return (
    <div className="flex flex-col w-full">
      {/* Track layer */}
      <div className="relative flex items-center w-full">
        {/* Background track */}
        <div className="absolute top-1/2 -translate-y-1/2 left-[10%] right-[10%] h-[3px] bg-base-content/15 rounded-full" />

        {/* Progress fill */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-[10%] h-[3px] bg-primary rounded-full transition-all duration-500"
          style={{ width: `${fillPercent}%` }}
        />

        {/* Icon nodes */}
        {steps.map((label, i) => {
          const done = i < step;
          const active = i === step;
          const isAwaitingStep = awaitingApproval && i === 2;

          return (
            <div key={i} className="relative flex-1 flex justify-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                  done || isAwaitingStep
                    ? 'bg-primary border-2 border-primary'
                    : active
                      ? 'bg-warning border-2 border-warning'
                      : 'bg-base-100 border-2 border-base-content/20'
                }`}
              >
                {done || isAwaitingStep ? (
                  <CircleCheck size={14} className="text-white" />
                ) : active && i === steps.length - 1 ? (
                  <Check size={14} className="text-white" />
                ) : active ? (
                  <LoaderCircle size={14} className="text-white animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-base-content/30" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels layer */}
      <div className="flex w-full mt-2">
        {steps.map((label, i) => {
          const done = i < step;
          const active = i === step;
          const isAwaitingStep = awaitingApproval && i === 2;

          return (
            <div key={i} className="flex-1 text-center">
              <span
                className={`text-[11px] leading-snug ${
                  done || active || isAwaitingStep
                    ? 'text-[#2D3748] font-semibold'
                    : 'text-base-content/40'
                }`}
              >
                {isAwaitingStep ? 'Awaiting' : label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressBar;
