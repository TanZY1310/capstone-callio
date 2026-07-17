import { MdCall } from 'react-icons/md';
import { IoPersonSharp } from 'react-icons/io5';
import { IoChatboxEllipsesSharp } from 'react-icons/io5';
import { TiTick } from 'react-icons/ti';
import { RiTeamFill } from 'react-icons/ri';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { TfiStatsUp } from 'react-icons/tfi';
import { IoWarningSharp } from 'react-icons/io5';

function LeaderCard({
  agents,
  calls,
  followUps,
  bookings,
  callsDeltaPct,
  bookingsDeltaPct,
}) {
  const periodLabel = 'vs last month';

  const formatDelta = (delta) => {
    // delta is always a number now — never null
    const prefix =
      delta > 0 ? `+${prefix}${delta}% ${periodLabel}` : 'This month';
    return prefix;
  };

  const deltaColor = (delta) => {
    if (delta > 0) return 'text-green-600';
    if (delta < 0) return 'text-red-500';
    return 'text-slate-400'; // exactly zero — neutral
  };

  const METRIC_CARDS = [
    {
      label: 'Total Agents',
      key: 'agents',
      value: agents,
      icon: RiTeamFill,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      subtext: 'Overall',
      subtextColor: 'text-slate-400',
    },
    {
      label: 'Team Calls',
      key: 'calls',
      value: calls,
      icon: MdCall,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      subtext: formatDelta(callsDeltaPct),
      subtextColor: deltaColor(callsDeltaPct),
    },
    {
      label: 'Pending Follow-Ups',
      key: 'pendingFollowUps',
      value: followUps,
      icon: IoWarningSharp,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      subtext: followUps > 0 ? 'Action required' : 'All caught up',
      subtextColor: followUps > 0 ? 'text-red-500' : 'text-green-600',
    },
    {
      label: 'Team Bookings',
      key: 'bookings',
      value: bookings,
      icon: TiTick,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      subtext: formatDelta(bookingsDeltaPct),
      subtextColor: deltaColor(bookingsDeltaPct),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {METRIC_CARDS.map((item) => (
        <div
          key={item.key}
          className="card bg-base-100 border border-base-200 shadow-sm p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="font-semibold text-lg text-base-content">
              {item.label}
            </span>
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
  );
}

export default LeaderCard;
