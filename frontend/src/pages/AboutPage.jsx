import { Database, HeartPulse, Layers, ShieldAlert } from 'lucide-react';
import { SEVERITY_TIERS } from '../utils/severity';

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-7">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-sky-50 p-3 text-sky-600">
            <HeartPulse className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              About HealthTrack
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              HealthTrack is a patient symptom monitoring platform designed to help individuals record day-to-day symptoms, rate intensity on a structured 1–10 scale, observe 30-day severity trends, and bring clear chronological summaries to healthcare appointments.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <h3 className="text-sm font-semibold text-amber-950">
              Medical &amp; Non-Diagnostic Disclaimer
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-amber-900">
              HealthTrack is strictly a personal symptom tracking and visualization tool. It is <strong>not</strong> a medical device, diagnostic engine, or emergency medical service. Severity labels (Mild, Moderate, High, Severe) are user-interface descriptions only. If you experience severe or worsening symptoms, contact a qualified healthcare professional or local emergency services immediately.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-teal-600" />
            <h3 className="text-base font-semibold text-slate-900">Severity Scale Reference</h3>
          </div>
          <div className="mt-4 space-y-3">
            {SEVERITY_TIERS.map((tier) => (
              <div
                key={tier.label}
                className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5"
              >
                <div>
                  <span className="text-sm font-semibold text-slate-900">
                    {tier.range} — {tier.label}
                  </span>
                  <p className="mt-0.5 text-xs text-slate-600">{tier.description}</p>
                </div>
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${tier.dotClass} mt-1.5`} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Database className="h-5 w-5 text-sky-600" />
            <h3 className="text-base font-semibold text-slate-900">Platform Architecture</h3>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
              <dt className="font-semibold text-slate-900">Frontend Layer</dt>
              <dd className="mt-1 text-xs text-slate-600">
                React.js (Vite), Tailwind CSS, React Router, Axios, Lucide icons, and Recharts for responsive 30-day visualizations.
              </dd>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
              <dt className="font-semibold text-slate-900">Backend REST API</dt>
              <dd className="mt-1 text-xs text-slate-600">
                Java 17 &amp; Spring Boot layered architecture (Controller, Service, Repository, Entity, DTO, Centralized Exception Handling) with UTC server-side timestamps.
              </dd>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
              <dt className="font-semibold text-slate-900">Database Persistence</dt>
              <dd className="mt-1 text-xs text-slate-600">
                MySQL <code className="font-mono text-slate-800">symptom_logs</code> table using parameterized Spring Data JPA queries and patient-isolated indexing. Demo records under <code className="font-mono text-slate-800">PATIENT001</code> are sample data only.
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
