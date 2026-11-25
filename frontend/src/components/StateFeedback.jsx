import { AlertTriangle, ClipboardList, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LoadingState({ message = 'Loading patient symptom records...' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-sky-100 border-t-sky-600" />
        <p className="text-sm font-medium text-slate-600">{message}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 shadow-xs"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-rose-100 p-2 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-rose-900">Unable to load symptom data</h3>
            <p className="mt-1 text-sm text-rose-700">{message}</p>
          </div>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  title = 'No symptom records yet',
  description = 'Once symptoms are recorded for this patient ID, they will appear here.',
  actionLabel = 'Log First Symptom',
  actionTo = '/log',
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-xs">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
        <ClipboardList className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">{description}</p>
      {actionLabel && actionTo && (
        <div className="mt-5">
          <Link
            to={actionTo}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-sky-700"
          >
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
