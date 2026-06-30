import { MdCall } from 'react-icons/md';
import { IoPersonSharp } from 'react-icons/io5';
import { IoChatboxEllipsesSharp } from 'react-icons/io5';
import { TiTick } from 'react-icons/ti';
import { RiTeamFill } from 'react-icons/ri';

const METRIC_CARDS = [
  {
    label: 'Total Agents',
    key: 'agents',
    icon: RiTeamFill,
  },
  { label: 'Total Leads', key: 'leads', icon: IoPersonSharp },
  { label: 'Total Calls Today', key: 'calls', icon: MdCall },

  { label: 'Appointment Set', key: 'appointments', icon: TiTick },
];

function LeaderCard({ agents, calls, leads, appointments }) {
  return (
    <>
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="stats shadow">
          {/* 1. Total Agents */}

          <div className="stat">
            <div className="stat-figure text-secondary">
              <RiTeamFill size={32} />
            </div>
            <div className="stat-title">Total Agents</div>
            <div className="stat-value">{agents}</div>
          </div>

          {/* 2. Total Leads */}

          <div className="stat">
            <div className="stat-figure text-secondary">
              <IoPersonSharp size={32} />
            </div>
            <div className="stat-title">Total Leads</div>
            <div className="stat-value">{leads}</div>
          </div>

          {/* 3. Total Calls */}

          <div className="stat">
            <div className="stat-figure text-secondary">
              <MdCall size={32} />
            </div>
            <div className="stat-title">Total Calls Today</div>
            <div className="stat-value">{calls}</div>
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

export default LeaderCard;
