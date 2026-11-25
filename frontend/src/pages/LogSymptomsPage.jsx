import { Link } from 'react-router-dom';
import { ClipboardCheck, Info, ShieldCheck } from 'lucide-react';
import SymptomForm from '../components/SymptomForm';
import SampleDataBanner from '../components/SampleDataBanner';

export default function LogSymptomsPage({ patientId, onSymptomCreated }) {
  return (
    <div className="space-y-6">
      <SampleDataBanner patientId={patientId} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-semibold text-slate-900">Record a New Symptom</h2>
            <p className="mt-1 text-sm text-slate-500">
              Entries are timestamped automatically by the server and saved to MySQL for longitudinal tracking.
            </p>
          </div>

          <div className="mt-6">
            <SymptomForm
              defaultPatientId={patientId}
              onSuccess={(saved) => {
                if (onSymptomCreated) {
                  onSymptomCreated(saved);
                }
              }}
            />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2.5 text-sky-700">
              <ClipboardCheck className="h-5 w-5" />
              <h3 className="text-sm font-semibold text-slate-900">Helpful Recording Tips</h3>
            </div>
            <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-slate-600">
              <li>
                <strong className="text-slate-800">Be specific:</strong> Note location, triggers, or timing (e.g., &ldquo;mild headache after screen work&rdquo;).
              </li>
              <li>
                <strong className="text-slate-800">Rate consistently:</strong> Use 1–3 for Mild, 4–6 for Moderate, 7–8 for High, and 9–10 for Severe discomfort.
              </li>
              <li>
                <strong className="text-slate-800">Track over time:</strong> Regular entries make your 30-day trend chart much clearer for provider visits.
              </li>
            </ul>
            <div className="mt-4 border-t border-slate-100 pt-3">
              <Link
                to="/history"
                className="text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                View Symptom History →
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5">
            <div className="flex items-center gap-2.5 text-teal-700">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="text-sm font-semibold text-slate-900">Non-Diagnostic Notice</h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              HealthTrack helps you organize personal symptom notes. It does not interpret symptoms medically, offer diagnoses, or replace urgent medical care.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
              <p className="text-xs leading-relaxed text-sky-900">
                Tip: Enter a different Patient ID such as <code className="font-mono font-semibold">PATIENT002</code> to test patient-isolated logging.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
