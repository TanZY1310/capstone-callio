// const STAGE_COLORS = [
//   'bg-blue-700', // darkest / top of funnel
//   'bg-blue-500',
//   'bg-slate-900', // final stage — make it look like the "destination" colorwise if you want, adjust freely
// ];

// function FunnelCard({ stages }) {
//   return (
//     <div className="flex items-center w-full">
//       {stages.map((item, index) => (
//         <div key={index} className="flex items-center flex-1">
//           {index > 0 && (
//             <span className="text-base-content/40 px-1 text-xl">→</span>
//           )}
//           <div
//             className={`flex-1 text-center p-3 rounded-lg ${STAGE_COLORS[index].bg} ${STAGE_COLORS[index].text}`}
//           >
//             <p className="text-xs font-bold tracking-wider">{item.stage}</p>
//             <p className="text-2xl font-bold mt-1">{item.value}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default FunnelCard;

const STAGE_STYLES = [
  { bg: 'bg-blue-50', text: 'text-blue-700', value: 'text-slate-900' },
  { bg: 'bg-blue-200', text: 'text-blue-900', value: 'text-slate-900' },
  { bg: 'bg-slate-900', text: 'text-white', value: 'text-white' },
];

const MIN_WIDTH_PCT = 45; // floor so stage 3 never gets unreadably thin on real-world ratios

export default function ConversionFunnel({ stages }) {
  // stages = [
  //   { label: "Total Leads", count: 128 },
  //   { label: "Pending Follow-ups", count: 18 },
  //   { label: "Appointments Set", count: 6 },
  // ]

  const maxCount = stages[0]?.count || 1;

  return (
    <div className="card bg-base-100  p-6">
      <h2 className="card-title text-base-content" style={{ padding: '5px' }}>
        Conversion Funnel
      </h2>

      <div className="flex flex-col gap-4">
        {stages.map((stage, i) => {
          const rawPct = (stage.count / maxCount) * 100;
          const widthPct = Math.max(rawPct, MIN_WIDTH_PCT);
          const style = STAGE_STYLES[i % STAGE_STYLES.length];

          return (
            <div
              key={stage.label}
              className={`flex items-center justify-between rounded-2xl px-6 py-5 shadow-sm p-6 ${style.bg}`}
              style={{ width: `${widthPct}%` }}
            >
              <span
                className={`text-sm font-bold uppercase tracking-wide ${style.text}`}
              >
                {stage.label}
              </span>
              <span className={`text-2xl font-extrabold ${style.value}`}>
                {stage.count.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
