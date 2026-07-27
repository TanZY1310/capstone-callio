import { MdCall, MdDoneAll } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import { RiTeamFill } from 'react-icons/ri';
import { IoWarningSharp } from 'react-icons/io5';
import { FaPercentage } from 'react-icons/fa';

function LeaderCard({
  calls,
  leads,
  followUps,
  bookings,
  completed,
  callsDeltaPct,
  leadsDeltaPct,
  bookingsDeltaPct,
  completedDeltaPct,
}) {
  const periodLabel = 'vs last month';

  const formatDelta = (delta) => {
    if (delta === null || delta === undefined) return '—';
    if (delta === 0) return 'This month';
    const sign = delta > 0 ? '+' : '';
    return `${sign}${delta}% ${periodLabel}`;
  };

  const deltaColor = (delta) => {
    if (delta === null || delta === undefined) return 'text-slate-400';
    if (delta > 0) return 'text-green-600';
    if (delta < 0) return 'text-red-500';
    return 'text-slate-400';
  };

  const METRIC_CARDS = [
    {
      label: 'Active Leads',
      key: 'leads',
      value: leads,
      icon: RiTeamFill,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      subtext: formatDelta(leadsDeltaPct),
      subtextColor: deltaColor(leadsDeltaPct),
    },
    {
      label: 'Team Calls',
      key: 'calls',
      value: calls,
      icon: MdCall,
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
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
      // deliberately no MTD subtext — live snapshot, not a period comparison
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

    {
      label: 'Team Completion',
      key: 'completion',
      value: completed,
      icon: FaPercentage,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      subtext: formatDelta(completedDeltaPct),
      subtextColor: deltaColor(completedDeltaPct),
    },

    // {
    //   label: 'Completed',
    //   key: 'completed',
    //   value: completed,
    //   icon: MdDoneAll,
    //   iconBg: 'bg-violet-100',
    //   iconColor: 'text-violet-600',
    //   subtext: formatDelta(completedDeltaPct),
    //   subtextColor: deltaColor(completedDeltaPct),
    // },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {METRIC_CARDS.map((item) => (
        <div
          key={item.key}
          className="card bg-base-100 border border-base-200 shadow-sm p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="font-semibold text-md text-base-content">
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
