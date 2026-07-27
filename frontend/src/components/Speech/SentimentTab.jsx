import { TriangleAlert, Sparkles } from 'lucide-react';
import DealHeatCard from './DealHeatCard';

function SentimentTab({ data, preferences, transcriptSummary, loading = false }) {
  if (loading && !data) {
    return (
      <div className="tab-panel">
        <div className="card-body gap-8 relative">
          <div className="animate-pulse flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <div className="h-5 w-44 bg-base-300 rounded-md" />
              <div className="h-3 w-72 bg-base-300 rounded-md" />
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-7 flex flex-col gap-4 p-5 rounded-xl border border-base-200 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-40 bg-base-300 rounded-md" />
                  <div className="h-6 w-36 bg-base-300 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex justify-center items-center">
                    <div className="w-44 h-44 rounded-full bg-base-200" />
                  </div>
                  <div className="flex flex-col gap-2.5 justify-center">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div key={n} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-base-300" />
                        <div className="h-3 w-16 bg-base-300 rounded-md" />
                        <div className="h-3 w-8 bg-base-300 rounded-md" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-5 flex flex-col gap-3">
                <div className="h-4 w-32 bg-base-300 rounded-md" />
                <div className="flex flex-col gap-2 p-4 rounded-xl border border-base-200">
                  <div className="h-3 w-3/4 bg-base-300 rounded-md" />
                  <div className="h-3 w-1/2 bg-base-300 rounded-md" />
                </div>
                <div className="h-4 w-40 bg-base-300 rounded-md" />
                <div className="flex flex-col gap-2 p-4 rounded-xl border border-base-200">
                  <div className="h-6 w-full bg-base-300 rounded-md" />
                  <div className="h-6 w-full bg-base-300 rounded-md" />
                </div>
                <div className="h-4 w-44 bg-base-300 rounded-md" />
                <div className="flex flex-col gap-2 p-4 rounded-xl border border-base-200">
                  <div className="h-3 w-full bg-base-300 rounded-md" />
                  <div className="h-3 w-full bg-base-300 rounded-md" />
                  <div className="h-3 w-2/3 bg-base-300 rounded-md" />
                </div>
              </div>
            </div>
          </div>

          {/* Overlay loading message */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <span className="loading loading-spinner loading-md text-primary" />
              <span className="text-sm font-medium text-base-content/75">
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
              <h3 className="font-bold text-base text-base-content">
                No Analysis Yet
              </h3>
              <p className="text-sm text-base-content/85 max-w-sm">
                Analysis pending. Review the transcript and click 'Approve' to
                extract sentiment insights.
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
          <p className="text-xs text-base-content/75">
            AI-generated emotional and intent insights from the conversation
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7 h-full">
            <DealHeatCard
              scores={data?.dealReadiness}
              scoreReasoning={data?.scoreReasoning}
              loading={loading}
            />
          </div>

          <div className="col-span-5 flex flex-col gap-4 h-full">
            <div className="flex flex-col gap-3">
              <span className="text-section-heading">🎯 Buyer Preferences</span>
              <div className="p-5 rounded-xl border border-base-200 bg-base-100 flex flex-col gap-2">
                <span className="text-sm font-semibold text-base-content">
                  {preferences?.preferences || '—'}
                </span>
                {preferences?.location && (
                  <span className="text-sm text-base-content/75">
                    Location: {preferences.location}
                  </span>
                )}
                {preferences?.budgetValue && (
                  <span className="text-sm text-base-content/75">
                    Budget: {preferences.budgetValue}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 flex-1">
              <span className="text-section-heading">⚠️ Buyer Concerns</span>
              <div className="p-5 rounded-xl border border-base-200 bg-base-100 flex-1 flex flex-col gap-2">
                {data?.objections?.length ? (
                  data.objections.map((o, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-3 bg-error/15 border border-error/80 rounded-xl"
                    >
                      <TriangleAlert className="text-error shrink-0 mt-0.5" size={14} />
                      <span className="text-sm text-error font-medium break-words">{o.charAt(0).toUpperCase() + o.slice(1)}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-base-content/75 italic">No data yet</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-section-heading">📝 Transcript Summary</span>
              <div className="p-5 rounded-xl border border-base-200 bg-base-100 flex flex-col gap-3">
                {transcriptSummary ? (
                  <>
                    {transcriptSummary.buyerInquiry && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-semibold text-base-content/60 uppercase tracking-wider">• Buyer Inquiry</span>
                        <span className="text-sm text-base-content leading-relaxed">{transcriptSummary.buyerInquiry}</span>
                      </div>
                    )}
                    <div className="border-t border-base-200/50" />
                    {transcriptSummary.keyFrictionPoint && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-semibold text-base-content/60 uppercase tracking-wider">• Key Friction Point</span>
                        <span className="text-sm text-base-content leading-relaxed">{transcriptSummary.keyFrictionPoint}</span>
                      </div>
                    )}
                    <div className="border-t border-base-200/50" />
                    {transcriptSummary.agreedOutcome && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-semibold text-base-content/60 uppercase tracking-wider">• Agreed Outcome</span>
                        <span className="text-sm text-base-content leading-relaxed">{transcriptSummary.agreedOutcome}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-base-content/75 italic">No data yet</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SentimentTab;
