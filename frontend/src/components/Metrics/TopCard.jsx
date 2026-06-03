import { MdCall } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { TiTick } from "react-icons/ti";

const METRIC_CARDS = [
  { label: "Total Calls Today", key: "calls" },
  { label: "Total Leads", key: "leads" },
  { label: "Pending Follow-Ups", key: "pendingFollowUps" },
  { label: "Appointment Set", key: "appointments" },
];

function TopCard({ stats }) {
  return (
    <>
      <div className="card bg-base-100">
        {/* {METRIC_CARDS.map(({ label, key }) => (
          <div
            key={key}
            className="card bg-base-100 border border-base-200 shadow-sm"
          >
            <div className="card-body p-4 gap-1">
              <p className="text-sm text-base-content/60">{label}</p>
              <p className="text-3xl font-bold text-base-content">
                {stats[key] ?? 0}
              </p>
            </div>
          </div>
        ))} */}

        {/* 1. Total Calls */}

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <MdCall size={32} />
            </div>
            <div className="stat-title">Total Calls Today</div>
            <div className="stat-value">{stats.calls}</div>
          </div>

          {/* 2. Total Leads */}

          <div className="stat">
            <div className="stat-figure text-secondary">
              <IoPersonSharp size={32} />
            </div>
            <div className="stat-title">Total Leads</div>
            <div className="stat-value">{stats.leads}</div>
            {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
          </div>

          {/* 3. Pending Follow-ups */}

          <div className="stat">
            <div className="stat-figure text-secondary">
              <IoChatboxEllipsesSharp size={32} />
            </div>
            <div className="stat-title">Pending Follow-Ups</div>
            <div className="stat-value">{stats.followUps}</div>
          </div>

          {/* 4. Booking confirmed */}

          <div className="stat">
            <div className="stat-figure text-secondary">
              <TiTick size={32} />
            </div>
            <div className="stat-title">Bookings Confirmed</div>
            <div className="stat-value">{stats.booking}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopCard;
