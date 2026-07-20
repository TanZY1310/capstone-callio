function LocationHeatmap({ locations }) {
  const sorted = [...locations].sort((a, b) => b.region_count - a.region_count);
  const top5 = sorted.slice(0, 5);

  const maxCount = Math.max(...top5.map((l) => l.region_count), 1);

  const getColor = (count) => {
    if (count === 0)
      return { bg: 'bg-base-300/30', text: 'text-base-content/30' };
    if (count <= 2) return { bg: 'bg-blue-100', text: 'text-blue-800' };
    if (count <= 5) return { bg: 'bg-blue-300', text: 'text-blue-900' };
    return { bg: 'bg-blue-600', text: 'text-white' };
  };

  return (
    <div className="card bg-base-100 p-6">
      <h2 className="card-title text-base-content mb-4">
        Preferred Locations By Leads
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {top5.map((loc) => {
          const { bg, text } = getColor(loc.region_count);
          const pct = ((loc.region_count / maxCount) * 100).toFixed(0);

          return (
            <div
              key={loc.region}
              className={`${bg} rounded-lg p-3 transition-all hover:ring-2 hover:ring-blue-400 hover:scale-[1.02] cursor-default`}
              title={`${loc.region}: ${loc.region_count} lead${loc.region_count !== 1 ? 's' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${text}`}>
                  {loc.region}
                </span>
                <span
                  className={`badge badge-sm ${loc.region_count >= 6 ? 'badge-outline text-white border-white/50' : `badge-ghost ${text}`}`}
                >
                  {loc.region_count}
                </span>
              </div>
              <div className="w-full h-1.5 bg-base-300/30 rounded-full mt-2">
                <div
                  className="h-full rounded-full bg-current opacity-30"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-base-content/50">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-100 inline-block" />
          1-2
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-300 inline-block" />
          3-5
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
          6+
        </div>
        <span>leads per location</span>
      </div>
    </div>
  );
}

export default LocationHeatmap;
