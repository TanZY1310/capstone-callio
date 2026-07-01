// const STAGE_STYLES = [
//   { bg: 'bg-blue-50', text: 'text-blue-700', value: 'text-slate-900' },
//   { bg: 'bg-blue-200', text: 'text-blue-900', value: 'text-slate-900' },
//   { bg: 'bg-slate-900', text: 'text-white', value: 'text-white' },
// ];

// const MIN_WIDTH_PCT = 50;

// function ConversionFunnel({ stages }) {
//   const maxCount = stages[0]?.count || 1;

//   return (
//     <div className="card bg-base-100 p-6">
//       <h2 className="card-title text-base-content" style={{ padding: '5px' }}>
//         Conversion Funnel
//       </h2>

//       <div className="flex flex-col gap-4">
//         {stages.map((stage, i) => {
//           const rawPct = (stage.count / maxCount) * 100;
//           const widthPct = Math.max(rawPct, MIN_WIDTH_PCT);
//           const style = STAGE_STYLES[i % STAGE_STYLES.length];

//           // step-over-step % change vs previous stage — guard against div-by-zero
//           const prevCount = i > 0 ? stages[i - 1].count : null;
//           const pctChange =
//             prevCount !== null
//               ? prevCount === 0
//                 ? null // previous stage was 0 — "% change" is undefined, don't fake a number
//                 : ((stage.count / prevCount) * 100).toFixed(0)
//               : null;

//           return (
//             <div
//               key={stage.label}
//               className={`flex items-center justify-between rounded-2xl px-6 py-5 shadow-sm p-6 ${style.bg}`}
//               style={{ width: `${widthPct}%` }}
//             >
//               <span
//                 className={`text-sm font-bold uppercase tracking-wide ${style.text}`}
//               >
//                 {stage.label}
//               </span>

//               <div className="flex items-center gap-3">
//                 <span className={`text-2xl font-extrabold ${style.value}`}>
//                   {stage.count.toLocaleString()}
//                 </span>

//                 {/* only render if we have a meaningful previous-stage comparison */}
//                 {pctChange !== null && (
//                   <span
//                     className={`text-xs font-semibold px-2 py-1 rounded-full ${
//                       i === 0
//                         ? ''
//                         : style.value === 'text-white'
//                           ? 'bg-white/20 text-white'
//                           : 'bg-black/10 text-slate-700'
//                     }`}
//                   >
//                     {pctChange}%
//                   </span>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default ConversionFunnel;

const STAGE_STYLES = [
  { bg: 'bg-blue-50', text: 'text-blue-700', value: 'text-slate-900' },
  { bg: 'bg-blue-200', text: 'text-blue-900', value: 'text-slate-900' },
  { bg: 'bg-slate-900', text: 'text-white', value: 'text-white' },
];

const MIN_WIDTH_PCT = 100;

function ConversionFunnel({ stages }) {
  const totalLeads = stages[0]?.count || 1;

  return (
    <div className="card bg-base-100 p-6">
      <h2 className="card-title text-base-content" style={{ padding: '5px' }}>
        Performance Overview
      </h2>

      <div className="flex flex-col gap-4">
        {stages.map((stage, i) => {
          const rawPct = (stage.count / totalLeads) * 100;
          const widthPct = Math.max(rawPct, MIN_WIDTH_PCT);

          const style =
            i === stages.length - 1
              ? STAGE_STYLES[STAGE_STYLES.length - 1]
              : STAGE_STYLES[i % (STAGE_STYLES.length - 1)];

          const pctOfTotal =
            i === 0 ? null : ((stage.count / totalLeads) * 100).toFixed(0);

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

              <div className="flex items-center gap-3">
                <span className={`text-2xl font-extrabold ${style.value}`}>
                  {stage.count.toLocaleString()}
                </span>

                {pctOfTotal !== null && (
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      style.value === 'text-white'
                        ? 'bg-white/20 text-white'
                        : 'bg-black/10 text-slate-700'
                    }`}
                  >
                    {pctOfTotal}% of leads
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ConversionFunnel;
