import { Sparkles } from 'lucide-react';

function Preferencecard({ data, loading }) {
  if (!loading && !data) {
    return (
      <div className="flex flex-col h-full">
        <span className="text-xs font-semibold text-[#2D3748]/60 uppercase tracking-wider mb-3">
          Callio Extracted Preference
        </span>
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center">
            <Sparkles size={28} className="text-base-content/30" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-base text-[#2D3748]">No Preferences Yet</h3>
            <p className="text-sm text-[#2D3748]/60 max-w-xs">
              Preferences will be extracted after you approve the transcript.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <span className="text-xs font-semibold text-[#2D3748]/60 uppercase tracking-wider mb-3">Callio Extracted Preference</span>
      {loading ? (
        <div className="flex flex-col gap-3">
          {/* Skeleton: Preferences */}
          <div className="dashboard-card p-5 animate-pulse">
            <div className="flex flex-col gap-2.5">
              <div className="h-3 w-20 rounded bg-base-200" />
              <div className="h-5 w-3/4 rounded bg-base-200" />
              <div className="h-3 w-full rounded bg-base-200" />
            </div>
          </div>

          {/* Skeleton: Urgency Signals */}
          <div className="dashboard-card p-5 animate-pulse">
            <div className="flex flex-col gap-3">
              <div className="h-3 w-28 rounded bg-base-200" />
              <div className="flex flex-wrap gap-2">
                <div className="h-7 w-16 rounded-lg bg-base-200" />
                <div className="h-7 w-20 rounded-lg bg-base-200" />
                <div className="h-7 w-14 rounded-lg bg-base-200" />
              </div>
            </div>
          </div>

          {/* Skeleton: Budget */}
          <div className="dashboard-card p-5 animate-pulse">
            <div className="flex flex-col gap-2.5">
              <div className="h-3 w-24 rounded bg-base-200" />
              <div className="h-5 w-1/2 rounded bg-base-200" />
              <div className="h-3 w-2/3 rounded bg-base-200" />
            </div>
          </div>
        </div>
      ) : (
      <div className="flex flex-col gap-3">
        <div className="dashboard-card p-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#2D3748]/60">🏠 Preferences</span>
            <span className="text-xl font-bold text-base-content break-words">
              {data?.preferences ?? '—'}
            </span>
            <span className="text-xs italic text-[#2D3748]/50">
              {data?.preferenceNote ?? 'No data yet'}
            </span>
          </div>
        </div>

        <div className="dashboard-card p-5">
          <div className="flex flex-col gap-3">
            <span className="text-xs text-[#2D3748]/60">❗ High Urgency Signal</span>
            <div className="flex flex-row flex-wrap gap-2">
              {data?.signals?.length ? (
                data.signals.map((signal, i) => (
                  <span
                    key={i}
                    className="inline-block bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-4 py-2 rounded-lg text-xs font-semibold break-words max-w-full"
                  >
                    {signal}
                  </span>
                ))
              ) : (
                <span className="text-sm text-[#2D3748]/50 italic">No data yet</span>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-card p-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#2D3748]/60">📊 Expected Budget</span>
            <span className="text-xl font-bold text-base-content">
              {data?.budgetValue ?? '—'}
            </span>
            <span className="text-xs italic text-[#2D3748]/50">
              {data?.budgetNote ?? 'No data yet'}
            </span>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
export default Preferencecard;
