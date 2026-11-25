import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Clock,
  Flame,
  PlusCircle,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import SeverityBadge from '../components/SeverityBadge';
import SeverityTrendChart from '../components/SeverityTrendChart';
import SampleDataBanner from '../components/SampleDataBanner';
import { EmptyState, ErrorState, LoadingState } from '../components/StateFeedback';
import { formatDate, formatTime } from '../utils/dateFormat';

export default function DashboardPage({ patientId, symptoms, trends, metrics, loading, error, onRefresh }) {
  const recentActivity = [...symptoms].slice(-5).reverse();

  return (
    <div className="space-y-6">
      <SampleDataBanner patientId={patientId} />

      <section className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-sky-600 via-sky-700 to-teal-600 p-6 text-white shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-sky-50 backdrop-blur-xs">
              <span>Active Patient ID:</span>
              <code className="font-mono font-semibold text-white">{patientId}</code>
            </div>
            <h2 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">
              Welcome to HealthTrack
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm text-sky-100">
              Monitor your recorded symptoms, severity patterns, and 30-day trends in one clear view to support informed conversations with your healthcare provider.
            </p>
          </div>

          <Link
            to="/log"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-xs transition hover:bg-sky-50"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Log New Symptom</span>
          </Link>
        </div>
      </section>

      {loading ? (
        <LoadingState message={`Loading dashboard metrics for ${patientId}...`} />
      ) : error ? (
        <ErrorState message={error} onRetry={onRefresh} />
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Symptom Entries"
              value={metrics.totalEntries}
              subtitle={`Recorded for ${patientId}`}
              icon={Activity}
              tone="sky"
            />
            <StatCard
              title="Average Severity"
              value={metrics.averageSeverity !== null ? `${metrics.averageSeverity}/10` : '—'}
              subtitle="Across all recorded entries"
              icon={BarChart3}
              tone="teal"
            />
            <StatCard
              title="Highest Recorded Severity"
              value={metrics.highestSeverity !== null ? `${metrics.highestSeverity}/10` : '—'}
              subtitle="Peak logged intensity"
              icon={Flame}
              tone={metrics.highestSeverity >= 7 ? 'rose' : 'amber'}
            />
            <StatCard
              title="Latest Activity"
              value={metrics.latestEntry ? formatDate(metrics.latestEntry.timestamp) : 'No entries'}
              subtitle={
                metrics.latestEntry
                  ? `Severity ${metrics.latestEntry.severity}/10 at ${formatTime(metrics.latestEntry.timestamp)}`
                  : 'Log a symptom to get started'
              }
              icon={Clock}
              tone="sky"
            />
          </section>

          {symptoms.length === 0 ? (
            <EmptyState
              title={`No symptom logs found for ${patientId}`}
              description="Start recording symptoms to unlock your 30-day severity trend chart and personal activity summary."
              actionLabel="Log First Symptom"
              actionTo="/log"
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6 xl:col-span-2">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      30-Day Symptom Severity Trend
                    </h3>
                    <p className="text-xs text-slate-500">
                      Daily average severity ratings over the past 30 days
                    </p>
                  </div>
                  <Link
                    to="/analytics"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700"
                  >
                    <span>Full Analytics</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <SeverityTrendChart trends={trends} height={290} />
              </section>

              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Recent Symptom Activity
                    </h3>
                    <p className="text-xs text-slate-500">Most recent logged entries</p>
                  </div>
                  <Link
                    to="/history"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700"
                  >
                    <span>View All</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <ul className="divide-y divide-slate-100">
                  {recentActivity.map((item) => (
                    <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-2 text-sm font-medium text-slate-800">
                          {item.description}
                        </p>
                        <div className="shrink-0">
                          <SeverityBadge severity={item.severity} />
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(item.timestamp)} · {formatTime(item.timestamp)}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
}
