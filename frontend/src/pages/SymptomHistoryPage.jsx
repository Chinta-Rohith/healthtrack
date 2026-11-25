import { useMemo, useState } from 'react';
import { ArrowDown, Search } from 'lucide-react';
import SeverityBadge from '../components/SeverityBadge';
import SampleDataBanner from '../components/SampleDataBanner';
import { EmptyState, ErrorState, LoadingState } from '../components/StateFeedback';
import { formatDate, formatTime } from '../utils/dateFormat';

export default function SymptomHistoryPage({ patientId, symptoms, loading, error, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSymptoms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return symptoms;
    return symptoms.filter((item) =>
      item.description.toLowerCase().includes(q)
    );
  }, [symptoms, searchQuery]);

  return (
    <div className="space-y-6">
      <SampleDataBanner patientId={patientId} />

      {loading ? (
        <LoadingState message={`Fetching symptom history for ${patientId}...`} />
      ) : error ? (
        <ErrorState message={error} onRetry={onRefresh} />
      ) : symptoms.length === 0 ? (
        <EmptyState
          title={`No symptom history for ${patientId}`}
          description="No symptom logs have been recorded under this patient ID yet. Add your first entry to build a timeline."
          actionLabel="Log Symptom"
          actionTo="/log"
        />
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Symptom History ({filteredSymptoms.length} {filteredSymptoms.length === 1 ? 'entry' : 'entries'})
              </h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                <ArrowDown className="h-3.5 w-3.5 text-teal-600" />
                <span>Sorted chronologically ascending — latest entries appear at the bottom</span>
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by symptom..."
                aria-label="Filter symptom history"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 transition focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          {filteredSymptoms.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No symptom entries match &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      Symptom Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      Severity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredSymptoms.map((entry, idx) => {
                    const isLatest = idx === filteredSymptoms.length - 1 && !searchQuery.trim();
                    return (
                      <tr
                        key={entry.id}
                        className={`transition hover:bg-slate-50/70 ${
                          isLatest ? 'bg-sky-50/30' : ''
                        }`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">
                          <div className="flex items-center gap-2">
                            <span>{entry.description}</span>
                            {isLatest && (
                              <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700">
                                Latest
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <SeverityBadge severity={entry.severity} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                          {formatDate(entry.timestamp)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                          {formatTime(entry.timestamp)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
