import { getSeverityMeta } from '../utils/severity';

export default function SeverityBadge({ severity, showNumeric = true }) {
  const meta = getSeverityMeta(severity);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${meta.badgeClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
      {showNumeric && <span>{severity}/10</span>}
      <span>{meta.label}</span>
    </span>
  );
}
