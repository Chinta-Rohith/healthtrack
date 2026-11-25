import { FlaskConical } from 'lucide-react';
import { DEMO_PATIENT_ID } from '../utils/severity';

export default function SampleDataBanner({ patientId }) {
  if (patientId !== DEMO_PATIENT_ID) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-sky-200/80 bg-sky-50/70 px-4 py-3 text-xs text-sky-900 sm:items-center sm:text-sm">
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 sm:mt-0" />
      <p>
        <span className="font-semibold">Sample Demonstration Data:</span> Records shown for{' '}
        <code className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-xs font-semibold text-sky-800">
          {DEMO_PATIENT_ID}
        </code>{' '}
        are realistic sample entries for demonstration only and do not represent real patient information.
      </p>
    </div>
  );
}
