function Preferencecard({ data }) {
  return (
    <div className="flex flex-col h-full">
      <span className="text-xs font-semibold text-base-content/40 uppercase tracking-wider mb-3">Callio Extracted Preference</span>
      <div className="flex flex-col gap-3">
        <div className="dashboard-card p-5">
          <div className="flex flex-col gap-1">
            <span className="text-card-subtitle">🏠 Preferences</span>
            <span className="text-xl font-bold text-base-content">
              {data?.preferences ?? '—'}
            </span>
            <span className="text-xs italic text-base-content/50">
              {data?.preferenceNote ?? 'No data yet'}
            </span>
          </div>
        </div>

        <div className="dashboard-card p-5">
          <div className="flex flex-col gap-3">
            <span className="text-card-subtitle">❗ High Urgency Signal</span>
            <div className="flex flex-row flex-wrap gap-2">
              {data?.signals?.length ? (
                data.signals.map((signal, i) => (
                  <span
                    key={i}
                    className="badge bg-info text-info-content border-none px-4 py-2 rounded-full text-xs font-semibold"
                  >
                    {signal}
                  </span>
                ))
              ) : (
                <span className="text-sm text-base-content/40 italic">No data yet</span>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-card p-5">
          <div className="flex flex-col gap-1">
            <span className="text-card-subtitle">📊 Expected Budget</span>
            <span className="text-xl font-bold text-base-content">
              {data?.budgetValue ?? '—'}
            </span>
            <span className="text-xs italic text-base-content/50">
              {data?.budgetNote ?? 'No data yet'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Preferencecard;
