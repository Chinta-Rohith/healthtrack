import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  TrendingUp,
  Info,
  ShieldAlert,
  X,
} from 'lucide-react';
import logoUrl from '../assets/healthtrack-logo.svg';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/log', label: 'Log Symptoms', icon: PlusCircle },
  { to: '/history', label: 'Symptom History', icon: ClipboardList },
  { to: '/analytics', label: 'Health Analytics', icon: TrendingUp },
  { to: '/about', label: 'About HealthTrack', icon: Info },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/35 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="HealthTrack logo" className="h-9 w-9 rounded-xl shadow-xs" />
            <div>
              <span className="block text-base font-bold tracking-tight text-slate-900">
                HealthTrack
              </span>
              <span className="block text-xs font-medium text-teal-600">
                Symptom Monitor
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 py-6" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-200/70'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 ${
                      isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl border border-amber-200/70 bg-amber-50/70 p-3.5">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-xs leading-relaxed text-amber-900">
                Personal symptom tracking tool only — not a medical diagnosis or emergency service.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
