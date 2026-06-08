import { MdCall } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { TiTick } from "react-icons/ti";

const METRIC_CARDS = [
  { label: "Total Leads", key: "leads" },
  { label: "Total Calls Today", key: "calls" },

  { label: "Pending Follow-Ups", key: "pendingFollowUps" },
  { label: "Appointment Set", key: "appointments" },
];

function TopCard({ dummyAgentData }) {
  return (
    <>
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        {/* 1. Total Leads */}

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <IoPersonSharp size={32} />
            </div>
            <div className="stat-title">Total Leads</div>
            <div className="stat-value">{dummyAgentData.leads}</div>
          </div>

          {/* 2. Total Calls */}

          <div className="stat">
            <div className="stat-figure text-secondary">
              <MdCall size={32} />
            </div>
            <div className="stat-title">Total Calls </div>
            <div className="stat-value">{dummyAgentData.calls}</div>
          </div>

          {/* 3. Pending Follow-ups */}

          <div className="stat">
            <div className="stat-figure text-secondary">
              <IoChatboxEllipsesSharp size={32} />
            </div>
            <div className="stat-title">Follow-Ups</div>
            <div className="stat-value">{dummyAgentData.followUps}</div>
          </div>

          {/* 4. Booking confirmed */}

          <div className="stat">
            <div className="stat-figure text-secondary">
              <TiTick size={32} />
            </div>
            <div className="stat-title">Booking Sets</div>
            <div className="stat-value">{dummyAgentData.appointments}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopCard;
