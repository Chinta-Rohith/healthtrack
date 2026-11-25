export default function StatCard({ title, value, subtitle, icon: Icon, tone = 'sky' }) {
  const toneStyles = {
    sky: 'bg-sky-50 text-sky-600 ring-sky-100',
    teal: 'bg-teal-50 text-teal-600 ring-teal-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    rose: 'bg-rose-50 text-rose-600 ring-rose-100',
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300/80">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
          {subtitle && <p className="mt-1.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`rounded-xl p-2.5 ring-1 ${toneStyles[tone] || toneStyles.sky}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
