import { MdCall } from 'react-icons/md';
import { IoPersonSharp } from 'react-icons/io5';
import { IoChatboxEllipsesSharp } from 'react-icons/io5';
import { TiTick } from 'react-icons/ti';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { useState } from 'react';

function TopCard({ period, calls, leads, followUps, appointments, bookings }) {
  const today = new Date();

  const [date, setDate] = useState(today.getMonth());

  const METRIC_CARDS = [
    // { label: 'Total Leads', key: 'leads', icon: IoPersonSharp, value: leads },
    { label: 'Total Calls', key: 'calls', icon: MdCall, value: calls },
    {
      label: 'Follow-Ups',
      key: 'pendingFollowUps',
      icon: IoChatboxEllipsesSharp,
      value: followUps,
    },
    {
      label: 'Appointment Set',
      key: 'appointments',
      icon: FaRegCalendarAlt,
      value: appointments,
    },
    // { label: 'Bookings', key: 'bookings', icon: TiTick, value: bookings },
  ];

  return (
    <>
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="stats shadow">
          {METRIC_CARDS.map((item) => (
            <div className="stat" key={item.key}>
              <div className="stat-figure text-secondary">
                <item.icon size={32} />
              </div>

              <div className="stat-title">
                {period === 'monthly'
                  ? `${item.label} - ${today.toLocaleString('en-US', { month: 'long' })}`
                  : `${item.label} - Today`}
              </div>

              <div className="stat-value">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default TopCard;
