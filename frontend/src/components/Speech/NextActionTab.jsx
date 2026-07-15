import { Building2, MapPin, DollarSign } from 'lucide-react';
import RobotAgentLoader from './RobotAgentLoader';

function matchBarGradient(score) {
  if (score >= 80) return 'from-success to-success/80';
  if (score >= 60) return 'from-info to-info/80';
  if (score >= 40) return 'from-warning to-warning/80';
  return 'from-base-300 to-base-400';
}

function matchScoreColor(score) {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-info';
  return 'text-warning';
}

function NextAction({ data, loading = false }) {
  if (loading && !data) {
    return (
      <div className="tab-panel">
        <div className="card-body">
          <div className="flex flex-col gap-1 mb-4">
            <h2 className="text-section-heading">Next Actions</h2>
            <p className="text-helper">
              AI-generated follow-up recommendations based on buyer conversation
            </p>
          </div>
          <RobotAgentLoader />
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

        <div className="flex flex-col gap-4">
          {data?.nextActions?.length ? (
            data.nextActions.map((action, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 bg-base-200 border border-base-200 rounded-xl hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-center min-w-9 h-9 rounded-full bg-neutral text-neutral-content font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-sm text-base-content">
                    Recommended Action
                  </span>
                  <span className="text-sm leading-relaxed text-base-content/60">
                    {action}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <span className="text-sm text-base-content/40 italic">No data yet</span>
          )}
        </div>

        {data?.propertySuggestions?.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-primary" />
              <span className="text-section-heading">Suggested Properties</span>
            </div>
            <div className="flex flex-col gap-3">
              {data.propertySuggestions.map((prop, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 p-5 bg-base-200 rounded-xl border border-base-300 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-base text-base-content truncate">{prop.propertyName}</span>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="relative w-20 h-3 bg-base-300 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${matchBarGradient(prop.matchScore)} transition-all duration-700 ease-out relative overflow-hidden`}
                          style={{ width: `${prop.matchScore}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${matchScoreColor(prop.matchScore)}`}>
                        {prop.matchScore}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {prop.location && (
                      <div className="flex items-center gap-1.5 text-sm text-base-content/60">
                        <MapPin size={14} />
                        <span>{prop.location}</span>
                      </div>
                    )}
                    {prop.budget && (
                      <div className="flex items-center gap-1.5 text-sm text-base-content/60">
                        <DollarSign size={14} />
                        <span>{prop.budget}</span>
                      </div>
                    )}
                  </div>

                  <span className="text-sm text-base-content/70 leading-relaxed">{prop.reason}</span>

                  {prop.highlights?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {prop.highlights.map((h, j) => (
                        <span key={j} className="badge badge-ghost badge-sm">{h}</span>
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
              <span className="text-sm text-base-content/60">Try uploading more property brochures via Agent Profile.</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 p-5 bg-neutral rounded-xl">
          <span className="font-bold text-sm text-neutral-content">
            🤖 AI Workflow Suggestion
          </span>
          <span className="text-sm text-neutral-content/70 leading-relaxed">
            Complete all recommended follow-up actions within the next 24 hours
            to maximize conversion probability and maintain buyer engagement.
          </span>
        </div>
      </div>
    </div>
  );
}
export default NextAction;
