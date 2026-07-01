import { Zap, AlertCircle } from 'lucide-react';

function TokenUsage() {
  // Mock data for token usage
  const tokensUsed = 125000;
  const tokenLimit = 500000;
  const percentage = Math.round((tokensUsed / tokenLimit) * 100);

  return (
    <div className="card w-full bg-base-100 border border-base-200 shadow-sm h-full backdrop-blur-md">
      <div className="card-body p-6 gap-5">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="w-10 rounded-lg bg-primary/10 p-1.5 flex items-center justify-center">
                <Zap className="text-primary w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-base-content flex items-center gap-1.5">
                Token Usage
              </h3>
              <p className="text-xs text-base-content/60">
                Monthly AI generation quota
              </p>
            </div>
          </div>
          
          <div className="badge badge-primary badge-outline text-xs py-3 font-mono">
            Pro Plan
          </div>
        </div>

        {/* Usage Stats */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-3xl font-bold font-mono tracking-tight text-base-content">
                {tokensUsed.toLocaleString()}
              </span>
              <span className="text-xs text-base-content/60 font-medium">
                Tokens Used
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-base-content/70 font-mono">
                / {tokenLimit.toLocaleString()}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between items-center text-[10px] font-semibold mb-2">
              <span className="text-base-content/60 uppercase tracking-wider">
                Capacity
              </span>
              <span className="text-primary font-bold">{percentage}%</span>
            </div>
            <progress
              className="progress progress-primary w-full"
              value={percentage}
              max="100"
            ></progress>
          </div>
        </div>

        {/* Info Area */}
        <div className="mt-2 flex items-center gap-3 bg-base-200/50 p-3 rounded-lg border border-base-300">
          <AlertCircle className="w-5 h-5 text-base-content/50 min-w-[20px]" />
          <p className="text-xs text-base-content/70">
            Usage resets on the 1st of every month.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TokenUsage;
