import { Smile, Target, Zap, TriangleAlert, Sparkles } from 'lucide-react';

function getSentimentStyle(value) {
  const v = (value || '').toLowerCase();
  if (v === 'positive') return { bg: 'bg-[#10B981]/15', text: 'text-[#2D3748]', border: 'border-[#10B981]/30' };
  if (v === 'negative' || v.includes('angry') || v.includes('rejected') || v.includes('not buying'))
    return { bg: 'bg-[#DC2626]/10', text: 'text-[#2D3748]', border: 'border-[#DC2626]/30' };
  return { bg: 'bg-[#F59E0B]/15', text: 'text-[#2D3748]', border: 'border-[#F59E0B]/30' };
}

function getIntentStyle(score) {
  if (score == null) return { bg: 'bg-base-200', text: 'text-[#2D3748]', border: 'border-base-300' };
  if (score >= 70) return { bg: 'bg-[#10B981]/15', text: 'text-[#2D3748]', border: 'border-[#10B981]/30' };
  if (score >= 50) return { bg: 'bg-[#F59E0B]/15', text: 'text-[#2D3748]', border: 'border-[#F59E0B]/30' };
  return { bg: 'bg-[#DC2626]/10', text: 'text-[#2D3748]', border: 'border-[#DC2626]/30' };
}

function getUrgencyStyle(value) {
  const v = (value || '').toLowerCase();
  if (v === 'high') return { bg: 'bg-[#10B981]/15', text: 'text-[#2D3748]', border: 'border-[#10B981]/30' };
  if (v === 'low' || v === 'none' || v === 'no urgency')
    return { bg: 'bg-[#DC2626]/10', text: 'text-[#2D3748]', border: 'border-[#DC2626]/30' };
  return { bg: 'bg-[#F59E0B]/15', text: 'text-[#2D3748]', border: 'border-[#F59E0B]/30' };
}

function SentimentTab({ data, loading = false }) {
  if (loading && !data) {
    return (
      <div className="tab-panel">
        <div className="card-body gap-8 relative">
          <div className="animate-pulse flex flex-col gap-8">
            {/* Section header skeleton */}
            <div className="flex flex-col gap-1">
              <div className="h-5 w-44 bg-base-300 rounded-md" />
              <div className="h-3 w-72 bg-base-300 rounded-md" />
            </div>

            {/* Metrics grid skeleton */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-col gap-2 p-4 rounded-xl border border-base-300 bg-base-200">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-base-300 rounded" />
                    <div className="h-3 w-24 bg-base-300 rounded-md" />
                  </div>
                  <div className="h-6 w-16 bg-base-300 rounded-md" />
                </div>
              ))}
            </div>

            {/* Emotional Signals skeleton */}
            <div className="flex flex-col gap-3">
              <div className="h-4 w-40 bg-base-300 rounded-md" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-8 w-20 bg-base-300 rounded-full" />
                ))}
              </div>
            </div>

            {/* Objections skeleton */}
            <div className="flex flex-col gap-3">
              <div className="h-4 w-52 bg-base-300 rounded-md" />
              <div className="flex flex-col gap-3">
                {[1, 2].map((n) => (
                  <div key={n} className="flex items-start gap-3 p-4 bg-base-200 border border-base-300 rounded-xl">
                    <div className="w-[18px] h-[18px] bg-base-300 rounded shrink-0" />
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-3 w-full bg-base-300 rounded-md" />
                      <div className="h-3 w-3/4 bg-base-300 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interest Tags skeleton */}
            <div className="flex flex-col gap-3">
              <div className="h-4 w-32 bg-base-300 rounded-md" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-8 w-24 bg-base-300 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Overlay loading message */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <span className="loading loading-spinner loading-md text-primary" />
              <span className="text-sm font-medium text-base-content/60">
                Extracting emotional insights...
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
              <h3 className="font-bold text-base text-[#2D3748]">No Analysis Yet</h3>
              <p className="text-sm text-[#2D3748]/60 max-w-sm">
                Analysis pending. Review the transcript and click 'Approve' to extract sentiment insights.
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
          <h2 className="text-section-heading">Sentiment Analysis</h2>
          <p className="text-xs text-[#2D3748]/60">
            AI-generated emotional and intent insights from the conversation
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              icon: <Smile />,
              label: 'Overall Sentiment',
              value: data?.overallSentiment ?? '—',
              style: getSentimentStyle(data?.overallSentiment),
            },
            {
              icon: <Target />,
              label: 'Intent Score',
              value: data?.intentScore != null ? `${data.intentScore}%` : '—',
              style: getIntentStyle(data?.intentScore),
            },
            {
              icon: <Zap />,
              label: 'Urgency Level',
              value: data?.urgency ?? '—',
              style: getUrgencyStyle(data?.urgency),
            },
          ].map((m) => (
            <div
              key={m.label}
              className={`flex flex-col gap-2 p-4 rounded-xl border ${m.style.bg} ${m.style.border}`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D3748]/70">
                {m.icon}
                <span>{m.label}</span>
              </div>
              <span className={`text-xl font-bold ${m.style.text}`}>
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* Emotional Signals */}
        <div className="flex flex-col gap-3">
          <span className="text-section-heading">
            Emotional Signals
          </span>
          <div className="flex flex-wrap gap-2">
            {data?.emotions?.length ? (
              data.emotions.map((e, i) => (
                <span
                  key={i}
                  className="badge bg-info/20 text-info-content border-none px-4 py-3 rounded-full text-xs font-bold"
                >
                  {e}
                </span>
              ))
            ) : (
              <span className="text-sm text-[#2D3748]/50 italic">No data yet</span>
            )}
          </div>
        </div>

        {/* Objections */}
        <div className="flex flex-col gap-3">
          <span className="text-section-heading">
            Buyer Concerns / Objections
          </span>
          <div className="flex flex-col gap-3">
            {data?.objections?.length ? (
              data.objections.map((o, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl"
                >
                  <span>
                    <TriangleAlert className="text-[#DC2626]" size={18} />
                  </span>
                  <span className="text-sm text-[#991B1B] break-words">{o}</span>
                </div>
              ))
            ) : (
              <span className="text-sm text-[#2D3748]/50 italic">No data yet</span>
            )}
          </div>
        </div>

        {/* Interest Tags */}
        <div className="flex flex-col gap-3">
          <span className="text-section-heading">
            Interest Tags
          </span>
          <div className="flex flex-wrap gap-2">
            {data?.interestTags?.length ? (
              data.interestTags.map((tag, i) => (
                <span
                  key={i}
                  className="badge bg-success/20 text-success-content border-none px-4 py-3 rounded-full text-xs font-bold"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-sm text-[#2D3748]/50 italic">No data yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default SentimentTab;
