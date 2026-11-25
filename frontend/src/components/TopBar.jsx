import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus, RefreshCw, UserCheck } from 'lucide-react';
import { DEMO_PATIENT_ID, validatePatientId } from '../utils/severity';

export default function TopBar({
  title,
  subtitle,
  patientId,
  onPatientIdChange,
  onRefresh,
  isRefreshing,
  onOpenMenu,
}) {
  const [draftPatientId, setDraftPatientId] = useState(patientId);
  const [inputError, setInputError] = useState('');

  const handleApplyPatient = (event) => {
    event.preventDefault();
    const trimmed = draftPatientId.trim();
    const err = validatePatientId(trimmed);
    if (err) {
      setInputError(err);
      return;
    }
    setInputError('');
    onPatientIdChange(trimmed);
  };

  const handleQuickDemo = () => {
    setDraftPatientId(DEMO_PATIENT_ID);
    setInputError('');
    onPatientIdChange(DEMO_PATIENT_ID);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              {title}
            </h1>
            {subtitle && <p className="text-xs text-slate-500 sm:text-sm">{subtitle}</p>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <form onSubmit={handleApplyPatient} className="flex items-center gap-1.5">
            <label htmlFor="header-patient-id" className="sr-only">
              Active Patient ID
            </label>
            <div className="relative flex items-center">
              <UserCheck className="pointer-events-none absolute left-2.5 h-4 w-4 text-teal-600" />
              <input
                id="header-patient-id"
                type="text"
                value={draftPatientId}
                onChange={(e) => {
                  setDraftPatientId(e.target.value);
                  if (inputError) setInputError('');
                }}
                maxLength={50}
                placeholder="PATIENT001"
                className="w-36 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-2.5 text-xs font-medium text-slate-800 transition focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 sm:w-40 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 sm:text-sm"
            >
              Switch
            </button>
            {patientId !== DEMO_PATIENT_ID && (
              <button
                type="button"
                onClick={handleQuickDemo}
                className="rounded-xl border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-medium text-teal-700 transition hover:bg-teal-100"
              >
                Demo
              </button>
            )}
          </form>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:text-sm"
            title="Refresh patient data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/log"
            className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-sky-700 sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Log Symptom</span>
          </Link>
        </div>
      </div>
      {inputError && (
        <div className="mx-auto max-w-7xl px-4 pb-2 sm:px-6 lg:px-8">
          <p className="text-xs text-rose-600">{inputError}</p>
        </div>
      )}
    </header>
  );
}
