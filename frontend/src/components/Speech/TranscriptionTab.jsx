import { useState, useEffect } from 'react';
import { FileAudio, Waves, Brain, CheckCheck } from 'lucide-react';

const steps = [
  { icon: FileAudio, text: 'Optimizing audio file size...' },
  { icon: Waves, text: 'Stripping background static...' },
  { icon: Brain, text: 'Gemini is transcribing your speech...' },
  { icon: CheckCheck, text: 'Formatting final text...' },
];

function TranscriptionTab({ data, loading = false, progressMessage = '' }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!loading || data) {
      setCurrentStep(0);
      return;
    }
    setCurrentStep(0);
    const timers = [
      setTimeout(() => setCurrentStep(1), 2500),
      setTimeout(() => setCurrentStep(2), 5500),
      setTimeout(() => setCurrentStep(3), 10000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [loading, data]);

  if (loading && !data) {
    return (
      <div className="tab-panel">
        <div className="card-body">
          <div className="flex flex-col gap-1 mb-4">
            <h2 className="text-section-heading">Call Transcription</h2>
            <p className="text-helper">
              AI-processed conversation between agent and buyer
            </p>
          </div>
          <div className="flex flex-col items-center gap-6 py-8">
            {/* CSS Animated Wave */}
            <div className="flex items-end gap-[3px] h-16">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[6px] rounded-full bg-primary/60"
                  style={{
                    height: `${40 + Math.sin(i * 0.5) * 30}%`,
                    transformOrigin: 'bottom',
                    animation: `wave-bounce 0.6s ease-in-out ${i * 0.06}s infinite alternate`,
                  }}
                />
              ))}
            </div>

            {/* Timed Steps */}
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isActive = i === currentStep;
                const isDone = i < currentStep;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-500 ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : isDone
                          ? 'text-base-content/40'
                          : 'text-base-content/20'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                    <span className="text-sm">{step.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Fallback debug message (hidden from users, for dev) */}
            {progressMessage && (
              <p className="text-[10px] text-base-content/20 text-center max-w-md">
                {progressMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-panel">
      <div className="card-body gap-8">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-1">
            <h2 className="text-section-heading">Call Transcription</h2>
            <p className="text-helper">
              AI-processed conversation between agent and buyer
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full">
            {data?.transcription?.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col gap-1 max-w-[70%] ${
                  item.speaker === 'agent'
                    ? 'items-start self-start'
                    : 'items-end self-end'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-base-content/50 capitalize">
                    {item.speaker}
                  </span>
                  {item.language && (
                    <span className="badge badge-ghost badge-xs capitalize">
                      {item.language}
                    </span>
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
                    item.speaker === 'agent'
                      ? 'bg-base-200 text-base-content'
                      : 'bg-neutral text-neutral-content'
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default TranscriptionTab;
