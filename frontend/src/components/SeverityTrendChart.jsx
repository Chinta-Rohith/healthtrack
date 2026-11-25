import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { formatTrendAxisDate, formatTrendTooltipDate } from '../utils/dateFormat';
import { getSeverityMeta } from '../utils/severity';

function TrendTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const point = payload[0].payload;
  const meta = getSeverityMeta(Math.round(point.averageSeverity));

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-md">
      <p className="text-xs font-semibold text-slate-900">
        {formatTrendTooltipDate(point.date)}
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
        <span className="text-xs text-slate-600">
          Average Severity:{' '}
          <strong className="font-semibold text-slate-900">
            {Number(point.averageSeverity).toFixed(1)} / 10
          </strong>
        </span>
      </div>
      <p className="mt-0.5 text-xs text-slate-500">
        {point.entryCount} {point.entryCount === 1 ? 'entry' : 'entries'} logged
      </p>
    </div>
  );
}

export default function SeverityTrendChart({ trends, height = 300 }) {
  if (!trends || trends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <TrendingUp className="h-5 w-5" />
        </div>
        <h4 className="mt-3 text-sm font-semibold text-slate-900">
          No 30-day trend data available
        </h4>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          Log symptom entries within the last 30 days to visualize daily average severity patterns over time.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trends} margin={{ top: 12, right: 16, left: -12, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatTrendAxisDate}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
            minTickGap={24}
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<TrendTooltip />} />
          <Line
            type="monotone"
            dataKey="averageSeverity"
            name="Average Severity"
            stroke="#0284c7"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#0d9488', stroke: '#ffffff', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
