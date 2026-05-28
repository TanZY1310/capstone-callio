import { useState } from "react";

function TopCard({ stats }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-2">
        <div
          className="card w-96 bg-base-100 card-md shadow-sm"
          style={{
            backgroundColor: "white",
            height: "100px",
            width: "400px",
          }}
        >
          <div className="card-body">
            <h2
              className="card-title"
              style={{ color: "black", fontSize: "16px" }}
            >
              Total Calls Today
            </h2>
            <p style={{ fontSize: "24px", color: "black" }}>{stats.calls}</p>
          </div>
        </div>

        <div
          className="card w-96 bg-base-100 card-md shadow-sm"
          style={{
            backgroundColor: "white",
            height: "100px",
            width: "400px",
          }}
        >
          <div className="card-body">
            <h2
              className="$$card-title"
              style={{ color: "black", fontSize: "16px" }}
            >
              Total Leads
            </h2>
            <p style={{ fontSize: "24px", color: "black" }}>{stats.leads}</p>
          </div>
        </div>

        <div
          className="card w-96 bg-base-100 card-md shadow-sm"
          style={{
            backgroundColor: "white",
            height: "100px",
            width: "400px",
          }}
        >
          <div className="card-body">
            <h2
              className="$$card-title"
              style={{ color: "black", fontSize: "16px" }}
            >
              Pending Follow-Ups
            </h2>
            <p style={{ fontSize: "24px", color: "black" }}>
              {stats.pendingFollowUps}
            </p>
          </div>
        </div>

        <div
          className="card w-96 bg-base-100 card-md shadow-sm"
          style={{
            backgroundColor: "white",
            height: "100px",
            width: "400px",
          }}
        >
          <div className="card-body">
            <h2
              className="card-title"
              style={{ color: "black", fontSize: "16px" }}
            >
              Appointment Set
            </h2>
            <p style={{ fontSize: "24px", color: "black" }}>
              {stats.appointments}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopCard;
