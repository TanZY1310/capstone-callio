import { MdCall } from 'react-icons/md';
import { IoPersonSharp } from 'react-icons/io5';
import { IoChatboxEllipsesSharp } from 'react-icons/io5';
import { TiTick } from 'react-icons/ti';

const METRIC_CARDS = [
  { label: 'Total Leads', key: 'leads', icon: IoPersonSharp },
  { label: 'Total Calls Today', key: 'calls', icon: MdCall },
  {
    label: 'Pending Follow-Ups',
    key: 'pendingFollowUps',
    icon: IoChatboxEllipsesSharp,
  },
  { label: 'Appointment Set', key: 'appointments', icon: TiTick },
];

function TopCard({ calls, leads, followUps, appointments }) {
  return (
    <>
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        {/* 1. Total Calls */}

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <MdCall size={32} />
            </div>
            <div className="stat-title">Total Calls Today</div>
            <div className="stat-value">{calls}</div>
          </div>

          {/* 2. Total Leads */}

          <div className="stat">
            <div className="stat-figure text-secondary">
              <IoPersonSharp size={32} />
            </div>
            <div className="stat-title">Total Leads</div>
            <div className="stat-value">{leads}</div>
          </div>

          {/* 3. Pending Follow-ups */}

          <div className="stat">
            <div className="stat-figure text-secondary">
              <IoChatboxEllipsesSharp size={32} />
            </div>
            <div className="stat-title">Pending Follow-Ups</div>
            <div className="stat-value">{followUps}</div>
          </div>

          {/* 4. Booking confirmed */}

          <div className="stat">
            <div className="stat-figure text-secondary">
              <TiTick size={32} />
            </div>
            <div className="stat-title">Appointment Sets</div>
            <div className="stat-value">{appointments}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopCard;
