import { MdCall } from 'react-icons/md';
import { IoPersonSharp } from 'react-icons/io5';
import { IoChatboxEllipsesSharp } from 'react-icons/io5';
import { TiTick } from 'react-icons/ti';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { useState } from 'react';
import { IoWarningSharp } from 'react-icons/io5';

function TopCard({ period, calls, leads, followUps, appointments, bookings }) {
  const today = new Date();

  const [date, setDate] = useState(today.getMonth());

  const METRIC_CARDS = [
    {
      label: 'Active Leads',
      key: 'leads',
      icon: IoPersonSharp,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      value: leads,
      subtext: period == 'daily' ? 'Today' : 'This Month',
      subtextColor: 'text-slate-400',
    },
    {
      label: 'Total Calls',
      key: 'calls',
      icon: MdCall,
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      value: calls,
      subtext: period == 'daily' ? 'Today' : 'This Month',
      subtextColor: 'text-slate-400',
    },
    {
      label: 'Pending Follow-Ups',
      key: 'pendingFollowUps',
      icon: IoWarningSharp,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
      value: followUps,
      subtext: period == 'daily' ? 'Today' : 'This Month',
      subtextColor: 'text-slate-400',
    },
    {
      label: 'Appointment Set',
      key: 'appointments',
      icon: FaRegCalendarAlt,
      value: appointments,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      subtext: period == 'daily' ? 'Today' : 'This Month',
      subtextColor: 'text-slate-400',
    },
    // {
    //   label: 'Bookings Confirmed',
    //   key: 'bookings',
    //   icon: TiTick,
    //   value: bookings,
    // },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {METRIC_CARDS.map((item) => (
          <div
            className="card bg-base-100 border border-base-200 shadow-sm p-4"
            key={item.key}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="font-semibold text-md text-base-content">
                {period === 'monthly' ? `${item.label} ` : `${item.label} `}
              </span>

              {/* - ${today.toLocaleString('en-US', { month: 'long' })} */}

              <div className={`${item.iconBg} rounded-lg p-2 shrink-0`}>
                <item.icon size={24} className={item.iconColor} />
              </div>
            </div>

            <div className="text-2xl font-bold text-base-content">
              {item.value}
            </div>

            {item.subtext && (
              <div className={`text-xs font-medium mt-1 ${item.subtextColor}`}>
                {item.subtext}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default TopCard;
