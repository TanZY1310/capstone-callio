const STAGE_STYLES = [
  {
    track: 'rgb(220, 228, 245)', // very light periwinkle — Total Leads track
    fill: 'rgb(180, 198, 235)', // slightly deeper periwinkle — Total Leads fill
    text: '#1e3a6e', // dark navy text
  },
  {
    track: 'rgb(148, 163, 190)', // medium slate blue — Appointments track
    fill: 'rgb(100, 116, 150)', // deeper slate — Appointments fill
    text: '#1e2d4a', // dark text
  },
  {
    track: 'rgb(68, 88, 134)', // dark navy — Bookings track
    fill: 'rgb(15, 30, 68)', // deeper navy — Bookings fill
    text: '#ffffff', // white text
  },
];

function ConversionFunnel({ stages }) {
  const totalLeads = stages[0]?.count || 1;

  return (
    <div className="card bg-base-100 p-6">
      <h2 className="card-title text-base-content mb-6">
        Performance Overview
      </h2>

      <div className="flex flex-col gap-5">
        {stages.map((stage, i) => {
          const pct = ((stage.count / totalLeads) * 100).toFixed(0);
          const fillPct = (stage.count / totalLeads) * 100;

          const style =
            i === stages.length - 1
              ? STAGE_STYLES[STAGE_STYLES.length - 1]
              : STAGE_STYLES[i % (STAGE_STYLES.length - 1)];

          return (
            <div key={stage.label} className="flex items-center gap-4">
              {/* label */}
              <span
                className="text-sm font-medium w-36 shrink-0 text-right"
                style={{ color: '#475569' }}
              >
                {stage.label}
              </span>

              {/* outer track — always full width */}
              <div
                className="relative flex-1 h-11 rounded-full"
                style={{ backgroundColor: style.track }}
              >
                {/* inner fill — proportional */}
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${fillPct}%`,
                    backgroundColor: style.fill,
                  }}
                />

                {/* text — always at right edge of track */}
                <div
                  className="absolute inset-0 flex items-center justify-end px-5 z-10"
                  style={{ color: style.text }}
                >
                  <span className="text-sm font-bold whitespace-nowrap">
                    {stage.count.toLocaleString()} ({pct}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ConversionFunnel;
