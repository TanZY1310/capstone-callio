import { useEffect, useState } from "react";

function FunnelCard({ data }) {
  const funnelStages = [
    { stage: "NEW", value: data.calls },
    { stage: "FOLLOW-UP", value: data.followUps },
    { stage: "APPOINTMENT", value: data.appointments },
    { stage: "BOOKING", value: data.booking },
  ];

  const colors = ["#dbeafe", "#93c5fd", "#3b82f6", "#1a3a7c"];
  const textColors = ["#1e3a8a", "#1e3a8a", "#ffffff", "#ffffff"];

  return (
    <div>
      <div className="funnel">
        <h3>Lead Conversion Funnel</h3>

        <div style={{ display: "flex", alignItems: "center", width: "1600px" }}>
          {funnelStages.map((item, index) => (
            <div
              key={index}
              style={{ display: "flex", alignItems: "center", flex: 1 }}
            >
              {/* Arrow between stages */}
              {index > 0 && (
                <span style={{ fontSize: 20, color: "white", padding: "4px" }}>
                  →
                </span>
              )}

              {/* Stage block */}
              <div
                className={`funnel-stage stage-${index}`}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "12px",
                  background: colors[index],
                  color: textColors[index],
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                  }}
                >
                  {item.stage}
                </span>
                <h2 style={{ margin: 0, fontSize: 20, color: "black" }}>
                  {item.value}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FunnelCard;
