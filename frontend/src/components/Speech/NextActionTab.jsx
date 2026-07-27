import { useState } from 'react';
import { Building, MapPin, DollarSign, Sparkles, X } from 'lucide-react';

function matchBadgeStyle(score) {
  if (score >= 80) return 'bg-success/30 text-success-content';
  if (score >= 60) return 'bg-info/30 text-info-content';
  return 'bg-warning/40 text-warning-content';
}

function NextAction({ data, loading = false }) {
  const [completedActions, setCompletedActions] = useState(new Set());
  const [dismissed, setDismissed] = useState(false);

  const toggleAction = (index) => {
    setCompletedActions((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  if (loading && !data) {
    return (
      <div className="tab-panel">
        <div className="card-body gap-8 relative">
          <div className="animate-pulse flex flex-col gap-8">
            {/* Section header skeleton */}
            <div className="flex flex-col gap-1">
              <div className="h-5 w-40 bg-base-300 rounded-md" />
              <div className="h-3 w-72 bg-base-300 rounded-md" />
            </div>

            {/* Action cards skeleton */}
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-start gap-4 p-5 bg-base-200 border border-base-200 rounded-xl">
                  <div className="w-5 h-5 mt-1 rounded bg-base-300 shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-3.5 w-36 bg-base-300 rounded-md" />
                    <div className="h-3 w-full bg-base-300 rounded-md" />
                    <div className="h-3 w-3/4 bg-base-300 rounded-md" />
                  </div>
                </div>
              ))}
            </div>

            {/* Property section header skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-[18px] h-[18px] bg-base-300 rounded-md" />
              <div className="h-5 w-48 bg-base-300 rounded-md" />
            </div>

            {/* Property cards skeleton */}
            <div className="flex flex-col gap-3">
              {[1, 2].map((n) => (
                <div key={n} className="flex flex-col gap-3 p-5 bg-base-200 rounded-xl border border-base-300">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-48 bg-base-300 rounded-md" />
                    <div className="h-6 w-12 bg-base-300 rounded-full" />
                  </div>
                  <div className="h-5 w-32 bg-base-300 rounded-md" />
                  <div className="h-3.5 w-40 bg-base-300 rounded-md" />
                  <div className="h-3 w-full bg-base-300 rounded-md" />
                  <div className="flex gap-2">
                    <div className="h-6 w-24 bg-base-300 rounded-md" />
                    <div className="h-6 w-32 bg-base-300 rounded-md" />
                    <div className="h-6 w-20 bg-base-300 rounded-md" />
                  </div>
                </div>
              ))}
            </div>

            {/* AI footer skeleton */}
            <div className="flex flex-col gap-2 p-5 bg-base-300 rounded-xl">
              <div className="h-4 w-48 bg-base-200/60 rounded-md" />
              <div className="h-3 w-full bg-base-200/60 rounded-md" />
              <div className="h-3 w-2/3 bg-base-200/60 rounded-md" />
            </div>
          </div>

          {/* Overlay loading message */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <span className="loading loading-spinner loading-md text-primary" />
              <span className="text-sm font-medium text-base-content/75">
                Generating tailored recommendations...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && !data) {
    return (
      <div className="tab-panel">
        <div className="card-body">
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center">
              <Sparkles size={28} className="text-base-content/30" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-base text-base-content">No Analysis Yet</h3>
              <p className="text-sm text-base-content/85 max-w-sm">
                Analysis pending. Review the transcript and click 'Approve' to extract next actions and property matches.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-panel">
      <div className="card-body gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-section-heading">Next Actions</h2>
          <p className="text-helper">
            AI-generated follow-up recommendations based on buyer conversation
          </p>
        </div>

        {!dismissed && (
          <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <Sparkles size={16} className="text-primary mt-0.5 shrink-0" />
            <div className="flex flex-col gap-1 flex-1">
              <span className="font-bold text-sm text-base-content">AI Workflow Suggestion</span>
              <span className="text-sm text-base-content/75 leading-relaxed">
                Complete all recommended follow-up actions within the next 24 hours
                to maximize conversion probability and maintain buyer engagement.
              </span>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="btn btn-ghost btn-xs btn-circle shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {data?.nextActions?.length ? (
            data.nextActions.map((action, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 p-5 bg-base-200 border border-base-200 rounded-xl hover:shadow-sm transition-all ${
                  completedActions.has(i) ? 'opacity-50' : ''
                }`}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/60 shrink-0 mt-0.5">
                  Action
                </span>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className={`text-sm leading-relaxed break-words ${
                    completedActions.has(i)
                      ? 'line-through text-base-content/30'
                      : 'text-base-content/75'
                  }`}>
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </span>
                </div>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary mt-1 shrink-0"
                  checked={completedActions.has(i)}
                  onChange={() => toggleAction(i)}
                />
              </div>
            ))
          ) : (
            <span className="text-sm text-base-content/40 italic">No data yet</span>
          )}
        </div>

        {data?.propertySuggestions?.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Building size={18} className="text-primary" />
              <span className="text-section-heading">Suggested Properties</span>
            </div>
            <div className="flex flex-col gap-3">
              {data.propertySuggestions.map((prop, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 p-5 bg-base-200 rounded-xl border border-base-300 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base text-base-content truncate">{prop.propertyName}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${matchBadgeStyle(prop.matchScore)}`}>
                      {prop.matchScore}%
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    {prop.budget && (
                      <div className="flex items-center gap-1.5 text-lg font-bold text-primary">
                        <DollarSign size={18} />
                        <span>{prop.budget}</span>
                      </div>
                    )}
                    {prop.location && (
                      <div className="flex items-center gap-1.5 text-sm font-medium text-base-content/85">
                        <MapPin size={14} />
                        <span>{prop.location}</span>
                      </div>
                    )}
                  </div>

                  <span className="text-sm text-base-content/85 leading-relaxed break-words">{prop.reason}</span>

                  {prop.highlights?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {prop.highlights.map((h, j) => (
                        <span key={j} className="px-3 py-1 bg-base-300/50 text-base-content/80 rounded-md text-xs">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(data?.propertySuggestions) && data.propertySuggestions.length === 0 && (
          <div className="flex items-start gap-3 p-4 bg-info/10 border border-info/40 rounded-xl">
            <span className="text-info text-sm">📋</span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-info-content">No matching properties found</span>
              <span className="text-sm text-base-content/75">Try uploading more property brochures via Agent Profile.</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
export default NextAction;
