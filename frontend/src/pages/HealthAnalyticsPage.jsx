import { CalendarDays, Layers, TrendingUp } from 'lucide-react';
import SeverityTrendChart from '../components/SeverityTrendChart';
import StatCard from '../components/StatCard';
import SampleDataBanner from '../components/SampleDataBanner';
import { ErrorState, LoadingState } from '../components/StateFeedback';
import { formatTrendTooltipDate } from '../utils/dateFormat';
import SeverityBadge from '../components/SeverityBadge';

export default function HealthAnalyticsPage({ patientId, trends, loading, error, onRefresh }) {
  const activeDays = trends.length;
  const total30DayEntries = trends.reduce((acc, item) => acc + item.entryCount, 0);
  const overall30DayAvg =
    activeDays > 0
      ? Number(
          (
            trends.reduce((acc, item) => acc + item.averageSeverity * item.entryCount, 0) /
            Math.max(total30DayEntries, 1)
          ).toFixed(1)
        )
      : null;

  const peakDay =
    activeDays > 0
      ? trends.reduce((max, curr) =>
          curr.averageSeverity > max.averageSeverity ? curr : max
        )
      : null;

  return (
    <div className="space-y-6">
      <SampleDataBanner patientId={patientId} />

      {loading ? (
        <LoadingState message={`Calculating 30-day symptom trends for ${patientId}...`} />
      ) : error ? (
        <ErrorState message={error} onRetry={onRefresh} />
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title="Active Days (30d)"
              value={activeDays}
              subtitle="Days with at least one logged symptom"
              icon={CalendarDays}
              tone="sky"
            />
            <StatCard
              title="30-Day Weighted Average"
              value={overall30DayAvg !== null ? `${overall30DayAvg}/10` : '—'}
              subtitle={
                total30DayEntries > 0
                  ? `Across ${total30DayEntries} recent entries`
                  : 'No entries in last 30 days'
              }
              icon={TrendingUp}
              tone="teal"
            />
            <StatCard
              title="Peak Daily Average"
              value={peakDay ? `${peakDay.averageSeverity.toFixed(1)}/10` : '—'}
              subtitle={peakDay ? formatTrendTooltipDate(peakDay.date) : 'No trend data'}
              icon={Layers}
              tone={peakDay && peakDay.averageSeverity >= 7 ? 'rose' : 'amber'}
            />
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-slate-900">
                30-Day Average Symptom Severity
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Daily averages computed from real stored logs for <span className="font-semibold text-slate-700">{patientId}</span>. Days without logs are not fabricated.
              </p>
            </div>
            <SeverityTrendChart trends={trends} height={360} />
          </section>

          {trends.length > 0 && (
            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
              <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Daily Severity Breakdown (Last 30 Days)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Date (UTC)
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Average Severity
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Entries Logged
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {trends.map((point) => (
                      <tr key={point.date} className="hover:bg-slate-50/60">
                        <td className="px-6 py-3.5 text-sm font-medium text-slate-800">
                          {formatTrendTooltipDate(point.date)}
                        </td>
                        <td className="px-6 py-3.5">
                          <SeverityBadge
                            severity={Math.round(point.averageSeverity)}
                            showNumeric={false}
                          />
                          <span className="ml-2 text-sm font-semibold text-slate-700">
                            {Number(point.averageSeverity).toFixed(1)}/10
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-sm text-slate-600">
                          {point.entryCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
