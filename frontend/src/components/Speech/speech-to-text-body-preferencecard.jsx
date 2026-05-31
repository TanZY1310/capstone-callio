function Preferencecard({ data }) {
  return (
    <div className="grid grid-cols-2 gap-6 w-full">
      {/* Budget */}
      <div className="card bg-base-100 border border-base-200">
        <div className="card-body gap-2 p-4">
          <span className="text-xs font-bold text-base-content/60">💵 Extracted Budget</span>
          <span className="text-xl font-bold text-base-content">{data.budgetValue}</span>
          <span className="text-xs italic text-base-content/60">{data.budgetNote}</span>
        </div>
      </div>

      {/* Preferences */}
      <div className="card bg-base-100 border border-base-200">
        <div className="card-body gap-2 p-4">
          <span className="text-xs font-bold text-base-content/60">🏠 Preferences</span>
          <span className="text-xl font-bold text-base-content">{data.preferences}</span>
          <span className="text-xs italic text-base-content/60">{data.preferenceNote}</span>
        </div>
      </div>

      {/* Urgency Signals */}
      <div className="card col-span-2 bg-base-100 border border-base-200">
        <div className="card-body gap-4 p-4">
          <span className="text-xs font-bold text-base-content/60">❗ High Urgency Signal</span>
          <div className="flex flex-row flex-wrap gap-2">
            {data.signals.map((signal, i) => (
              <span key={i} className="badge bg-info/20 text-info-content border-none px-4 py-3 rounded-full text-xs font-bold">
                {signal}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Preferencecard;