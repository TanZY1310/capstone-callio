import { CircleCheck, LoaderCircle, Check } from 'lucide-react';

const steps = [
  "Uploading",
  "AI extraction",
  "Transcription",
  "Analysis",
  "Complete",
];

function ProgressBar({ step = -1, awaitingApproval = false }) {
  return (
    <ul className="timeline timeline-vertical mt-10 w-full [&_hr]:w-1">
      {steps.map((label, i) => {
        const done = i < step;
        const active = i === step;

        const hrColor = done || active ? "bg-primary" : "";
        const circleColor = done ? "text-primary" : active ? "text-warning" : "text-base-content/30";
        const boxStyle = done || active
          ? "text-lg font-medium px-6 py-3"
          : "text-lg font-medium px-6 py-3 text-base-content/30";
        const align = i % 2 === 0 ? "timeline-start" : "timeline-end";

        const isAwaitingStep = awaitingApproval && i === 2;

        return (
          <li key={i}>
            {i > 0 && <hr className={hrColor} />}
            <div className={`${align} timeline-box ${boxStyle}`}>
              {isAwaitingStep ? "Awaiting Approval" : label}
            </div>
            <div className="timeline-middle">
              {done || isAwaitingStep ? (
                <CircleCheck size={28} className={done ? circleColor : "text-primary"} />
              ) : active && i === steps.length - 1 ? (
                <Check size={28} className="text-primary" />
              ) : active ? (
                <LoaderCircle size={28} className="text-warning animate-spin" />
              ) : (
                <CircleCheck size={28} className={circleColor} />
              )}
            </div>
            {i < steps.length - 1 && <hr className={hrColor} />}
          </li>
        );
      })}
    </ul>
  );
}

export default ProgressBar;
