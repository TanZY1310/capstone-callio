const FUNNEL_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-900" },
  { bg: "bg-blue-300", text: "text-blue-900" },
  { bg: "bg-blue-500", text: "text-white" },
  { bg: "bg-blue-900", text: "text-white" },
];

function FunnelCard({ data }) {
  const funnelStages = [
    { stage: "NEW",         value: data.calls },
    { stage: "FOLLOW-UP",   value: data.followUps },
    { stage: "APPOINTMENT", value: data.appointments },
    { stage: "BOOKING",     value: data.booking },
  ];

  return (
    <div className="flex items-center w-full">
      {funnelStages.map((item, index) => (
        <div key={index} className="flex items-center flex-1">
          {index > 0 && (
            <span className="text-base-content/40 px-1 text-xl">→</span>
          )}
          <div className={`flex-1 text-center p-3 rounded-lg ${FUNNEL_COLORS[index].bg} ${FUNNEL_COLORS[index].text}`}>
            <p className="text-xs font-bold tracking-wider">{item.stage}</p>
            <p className="text-2xl font-bold mt-1">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FunnelCard;