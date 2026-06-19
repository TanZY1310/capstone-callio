import { Smile, Target, Zap, TriangleAlert } from 'lucide-react';
function SentimentTab({ data }) {
  return (
    <div className="tab-panel">
      <div className="card-body gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="card-title text-base-content">Sentiment Analysis</h2>
          <p className="text-sm text-base-content/50">
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
            },
            {
              icon: <Target />,
              label: 'Intent Score',
              value: data?.intentScore != null ? `${data.intentScore}%` : '—',
            },
            { icon: <Zap />, label: 'Urgency Level', value: data?.urgency ?? '—' },
          ].map((m) => (
            <div
              key={m.label}
              className="flex flex-col gap-2 p-4 bg-base-200 rounded-xl"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-base-content/50">
                {m.icon}
                <span>{m.label}</span>
              </div>
              <span className="text-xl font-bold text-base-content">
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* Emotional Signals */}
        <div className="flex flex-col gap-3">
          <span className="font-bold text-sm text-base-content">
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
              <span className="text-sm text-base-content/40 italic">No data yet</span>
            )}
          </div>
        </div>

        {/* Objections */}
        <div className="flex flex-col gap-3">
          <span className="font-bold text-sm text-base-content">
            Buyer Concerns / Objections
          </span>
          <div className="flex flex-col gap-3">
            {data?.objections?.length ? (
              data.objections.map((o, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/40 rounded-xl"
                >
                  <span>
                    <TriangleAlert />
                  </span>
                  <span className="text-sm text-base-content/70">{o}</span>
                </div>
              ))
            ) : (
              <span className="text-sm text-base-content/40 italic">No data yet</span>
            )}
          </div>
        </div>

        {/* Interest Tags */}
        <div className="flex flex-col gap-3">
          <span className="font-bold text-sm text-base-content">
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
              <span className="text-sm text-base-content/40 italic">No data yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default SentimentTab;
