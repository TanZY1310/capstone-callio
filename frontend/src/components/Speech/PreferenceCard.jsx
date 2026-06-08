function Preferencecard({ data }) {
  return (
    <>
      {/* Row 1 — Budget + Preferences side by side */}
      <div className="dashboard-card p-5 flex items-center gap-4">
        <div className="card-body p-5">
          <span className="text-card-subtitle">💵 Extracted Budget</span>
          <span className="text-xl font-bold text-base-content">
            {data.budgetValue}
          </span>
          <span className="text-xs italic text-base-content/50">
            {data.budgetNote}
          </span>
        </div>
      </div>

      <div className="dashboard-card p-5 flex items-center gap-4">
        <div className="card-body p-5">
          <span className="text-card-subtitle">🏠 Preferences</span>
          <span className="text-xl font-bold text-base-content">
            {data.preferences}
          </span>
          <span className="text-xs italic text-base-content/50">
            {data.preferenceNote}
          </span>
        </div>
      </div>

      {/* Row 2 — Urgency full width */}
      <div className="dashboard-card flex col-span-2 p-5">
        <div className="card-body gap-3 p-5">
          <span className="text-card-subtitle">❗ High Urgency Signal</span>
          <div className="flex flex-row flex-wrap gap-2">
            {data.signals.map((signal, i) => (
              <span
                key={i}
                className="badge bg-info text-info-content border-none px-4 py-2 rounded-full text-xs font-semibold"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default Preferencecard;
