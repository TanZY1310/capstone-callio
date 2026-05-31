const METRIC_CARDS = [
  { label: "Total Calls Today",  key: "calls" },
  { label: "Total Leads",        key: "leads" },
  { label: "Pending Follow-Ups", key: "pendingFollowUps" },
  { label: "Appointment Set",    key: "appointments" },
];

function TopCard({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {METRIC_CARDS.map(({ label, key }) => (
        <div key={key} className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-4 gap-1">
            <p className="text-sm text-base-content/60">{label}</p>
            <p className="text-3xl font-bold text-base-content">{stats[key] ?? 0}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TopCard;