import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const DIMENSION_LABELS = {
  purchaseIntent: 'Purchase Intent',
  purchaseUrgency: 'Purchase Urgency',
  financialReadiness: 'Financial Readiness',
  locationAlignment: 'Location Alignment',
  callSentiment: 'Call Sentiment',
};

function getDealStatus(overallScore) {
  if (overallScore > 75)
    return {
      label: 'Hot Lead',
      color: 'text-success',
      badgeBg: 'bg-success/15',
      border: 'border-success/30',
      chartStroke: 'var(--color-success)',
      chartFill: 'var(--color-success)',
    };
  if (overallScore >= 50)
    return {
      label: 'Warm Lead',
      color: 'text-warning',
      badgeBg: 'bg-warning/15',
      border: 'border-warning/30',
      chartStroke: 'var(--color-warning)',
      chartFill: 'var(--color-warning)',
    };
  return {
    label: 'Cold Lead',
    color: 'text-error',
    badgeBg: 'bg-error/20',
    border: 'border-error/20',
    chartStroke: 'var(--color-error)',
    chartFill: 'var(--color-error)',
  };
}

function DealHeatCard({ scores, scoreReasoning, loading = false }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  if (loading && !scores) {
    return (
      <div className="flex flex-col gap-4 p-5 rounded-xl border border-base-200 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="h-4 w-40 bg-base-300 rounded-md" />
          </div>
          <div className="h-6 w-36 bg-base-300 rounded-full" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-center items-center">
            <div className="w-48 h-48 rounded-full bg-base-200" />
          </div>
          <div className="flex flex-col gap-2.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-base-300" />
                <div className="h-3 w-16 bg-base-300 rounded-md" />
                <div className="h-3 w-8 bg-base-300 rounded-md" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-6 w-20 bg-base-300 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!scores) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center rounded-xl border border-dashed border-base-300">
        <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center">
          <Sparkles size={22} className="text-base-content/30" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sm text-base-content">
            No Deal Readiness Data Yet
          </span>
          <span className="text-xs text-base-content/75">
            Analysis will appear after the transcript is approved.
          </span>
        </div>
      </div>
    );
  }

  const chartData = Object.entries(DIMENSION_LABELS).map(([key, label]) => ({
    key,
    subject: label,
    score: scores[key] ?? 0,
    fullMark: 100,
  }));

  const overallScore = Math.round(
    chartData.reduce((acc, item) => acc + item.score, 0) / chartData.length,
  );

  const status = getDealStatus(overallScore);

  const SHORT = {
    'Purchase Intent': 'Intent',
    'Purchase Urgency': 'Urgency',
    'Financial Readiness': 'Financial',
    'Location Alignment': 'Location',
    'Call Sentiment': 'Sentiment',
  };

  function dotColor(score) {
    return score > 75 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-error';
  }

  return (
    <div
      className={`flex flex-col gap-4 p-5 rounded-xl border ${status.border} h-full`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-base-content">
          Deal Readiness Index
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${status.badgeBg} ${status.color}`}
        >
          {overallScore}% — {status.label}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke="var(--color-base-300)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'var(--color-base-content)', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="var(--color-base-300)"
                tick={{ fontSize: 10, fill: 'var(--color-base-content)' }}
              />
              <Radar
                name="Deal Readiness"
                dataKey="score"
                stroke={status.chartStroke}
                fill={status.chartFill}
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-2">
          {chartData.map((item, idx) => {
            const reasoning = scoreReasoning?.[item.key];
            const isExpanded = expandedIndex === idx;
            return (
              <div key={item.subject}>
                <div
                  className="flex items-center gap-3 cursor-pointer py-0.5"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                >
                  <span className={`w-2 h-2 rounded-full ${dotColor(item.score)} shrink-0`} />
                  <span className="text-sm font-medium text-base-content w-16 shrink-0">
                    {SHORT[item.subject]}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-base-200">
                    <div
                      className={`h-full rounded-full ${dotColor(item.score)}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-base-content w-10 text-right">
                    {item.score}%
                  </span>
                  {reasoning && (
                    <span className="text-base-content/40 shrink-0">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                  )}
                </div>
                {isExpanded && reasoning && (
                  <div className="ml-7 mt-2 mb-3 p-3 rounded-xl bg-base-200/40 border border-base-200">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-semibold text-base-content/60 uppercase tracking-wider">
                        Key Quote
                      </span>
                      <p className="text-sm italic text-base-content/85 border-l-2 border-primary/60 pl-3 leading-relaxed">
                        &ldquo;{reasoning.keyQuote}&rdquo;
                      </p>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-base-200/50">
                      <span className="text-[11px] font-semibold text-base-content/60 uppercase tracking-wider">
                        AI Reasoning
                      </span>
                      <p className="text-xs text-base-content/70 mt-0.5 leading-relaxed">
                        {reasoning.reasoning}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DealHeatCard;
