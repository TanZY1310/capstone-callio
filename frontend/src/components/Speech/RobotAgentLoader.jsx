import { useState, useEffect } from 'react';
import { Bot, FileText, Search, Database, BarChart3, CheckCircle2, MapPin } from 'lucide-react';

const steps = [
  { icon: Database, text: 'Scanning property database...' },
  { icon: MapPin, text: 'Filtering by buyer location & budget...' },
  { icon: FileText, text: 'Analyzing property documents...' },
  { icon: BarChart3, text: 'Computing relevance scores...' },
  { icon: Search, text: 'Cross-referencing preferences...' },
  { icon: CheckCircle2, text: 'Ranking top recommendations...' },
];

export default function RobotAgentLoader() {
  const [currentStep, setCurrentStep] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2800);
    const countTimer = setInterval(() => {
      setProcessedCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 350);
    return () => { clearInterval(stepTimer); clearInterval(countTimer); };
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="flex flex-col items-center gap-5 py-6">
      {/* Radar rings + Robot */}
      <div className="relative flex items-center justify-center h-28">
        <div className="absolute w-28 h-28 rounded-full border border-primary/15 animate-ping" />
        <div className="absolute w-36 h-36 rounded-full border border-primary/10 animate-pulse" />

        {/* Robot core */}
        <div className="relative bg-base-200 p-4 rounded-2xl border-2 border-base-300 z-10">
          <div className="w-14 h-14 flex items-center justify-center relative">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex gap-2.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.15s]" />
            </div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-base-300 rounded overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-primary to-secondary animate-[shimmer_1.5s_ease-in-out_infinite]" />
            </div>
            <Bot className="w-10 h-10 text-base-content/30" strokeWidth={1.5} />
          </div>
        </div>

        {/* Floating document indicators */}
        <div className="absolute -left-8 top-0 bg-base-100 border border-base-300 px-2 py-1 rounded-lg shadow-sm animate-bounce [animation-duration:3s]">
          <FileText className="w-3 h-3 text-accent inline mr-1" />
          <span className="text-[10px] font-mono text-base-content/60">doc_09412</span>
        </div>
        <div className="absolute -right-8 bottom-1 bg-base-100 border border-base-300 px-2 py-1 rounded-lg shadow-sm animate-bounce [animation-duration:4s]">
          <Search className="w-3 h-3 text-primary inline animate-spin [animation-duration:8s]" />
          <span className="text-[10px] font-mono text-base-content/60 ml-1">Match</span>
        </div>
      </div>

      {/* Activity panel */}
      <div className="bg-base-200 border border-base-300 rounded-xl p-3.5 w-full max-w-xs">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-base-100 rounded-lg border border-base-300 shrink-0">
            <CurrentIcon className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-base-content/40 uppercase tracking-wider font-semibold">Current Activity</p>
            <p className="text-sm text-base-content font-medium truncate">{steps[currentStep].text}</p>
          </div>
        </div>
      </div>

      {/* Progress dots + counter */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentStep
                  ? 'w-5 bg-primary'
                  : i < currentStep
                    ? 'w-1.5 bg-base-300'
                    : 'w-1.5 bg-base-200'
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-mono text-base-content/40">
          {processedCount} docs
        </span>
      </div>
    </div>
  );
}
