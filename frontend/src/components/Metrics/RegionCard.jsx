const regionData = [
  { name: "Mont Kiara", count: 42 },
  { name: "Bangsar", count: 36 },
  { name: "Puchong", count: 28 },
  { name: "Cheras", count: 22 },
];

function LeadsByRegion() {
  const max = regionData[0].count; // biggest value = 100% bar width

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "20px 20px 12px",
        width: 500,
        marginLeft: "auto", // ← add this
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "#6b7280",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        Leads by Region
      </p>

      {regionData.map((region) => {
        const widthPct = Math.round((region.count / max) * 100);

        return (
          <div key={region.name} style={{ marginBottom: 14 }}>
            {/* Name + number row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {region.name}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                {region.count}
              </span>
            </div>

            {/* Progress bar */}
            <div
              style={{
                height: 5,
                background: "#e5e7eb",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${widthPct}%`,
                  height: 5,
                  background: "#1a3aff",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LeadsByRegion;
