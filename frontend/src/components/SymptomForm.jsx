import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { createSymptom, extractApiErrorMessage } from '../services/api';
import {
  MAX_DESCRIPTION_LENGTH,
  SEVERITY_TIERS,
  getSeverityMeta,
  isValidSeverity,
  validatePatientId,
} from '../utils/severity';
import SeverityBadge from './SeverityBadge';

const SEVERITY_SCALE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function SymptomForm({ defaultPatientId = 'PATIENT001', onSuccess }) {
  const [patientId, setPatientId] = useState(defaultPatientId);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setPatientId(defaultPatientId);
  }, [defaultPatientId]);

  const validateForm = () => {
    const errors = {};

    const patientErr = validatePatientId(patientId);
    if (patientErr) {
      errors.patientId = patientErr;
    }

    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      errors.description = 'Symptom description is required.';
    } else if (trimmedDesc.length > MAX_DESCRIPTION_LENGTH) {
      errors.description = `Symptom description must not exceed ${MAX_DESCRIPTION_LENGTH} characters.`;
    }

    if (severity === null || severity === '' || !isValidSeverity(severity)) {
      errors.severity = 'Please select a severity rating between 1 and 10.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setApiError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        patientId: patientId.trim(),
        description: description.trim(),
        severity: Number(severity),
      };

      const result = await createSymptom(payload);
      const savedRecord = result?.data ?? result;

      setDescription('');
      setSeverity(null);
      setFieldErrors({});
      setSuccessMessage(
        result?.message || 'Symptom entry recorded successfully.'
      );

      if (onSuccess) {
        onSuccess(savedRecord);
      }
    } catch (err) {
      setApiError(extractApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMeta = severity ? getSeverityMeta(severity) : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {successMessage && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
          <div>
            <p className="font-semibold">Entry Saved</p>
            <p className="mt-0.5 text-teal-800">{successMessage}</p>
          </div>
        </div>
      )}

      {apiError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <div>
            <p className="font-semibold">Could Not Save Symptom</p>
            <p className="mt-0.5 text-rose-800">{apiError}</p>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="patientId" className="block text-sm font-semibold text-slate-800">
          Patient ID <span className="text-rose-500">*</span>
        </label>
        <input
          id="patientId"
          name="patientId"
          type="text"
          value={patientId}
          onChange={(e) => {
            setPatientId(e.target.value);
            if (fieldErrors.patientId) {
              setFieldErrors((prev) => ({ ...prev, patientId: '' }));
            }
          }}
          maxLength={50}
          placeholder="e.g., PATIENT001"
          className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 transition focus:outline-none focus:ring-2 ${
            fieldErrors.patientId
              ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-200 bg-white focus:border-sky-500 focus:ring-sky-500/20'
          }`}
        />
        {fieldErrors.patientId ? (
          <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.patientId}</p>
        ) : (
          <p className="mt-1.5 text-xs text-slate-500">
            Records are stored and retrieved strictly under this patient identifier.
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="description" className="block text-sm font-semibold text-slate-800">
            Symptom Description <span className="text-rose-500">*</span>
          </label>
          <span
            className={`text-xs font-medium ${
              description.trim().length > MAX_DESCRIPTION_LENGTH
                ? 'text-rose-600'
                : 'text-slate-400'
            }`}
          >
            {description.trim().length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (fieldErrors.description) {
              setFieldErrors((prev) => ({ ...prev, description: '' }));
            }
          }}
          placeholder="Describe what you are experiencing (e.g., throbbing headache, morning fatigue, dry cough)"
          className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 transition focus:outline-none focus:ring-2 ${
            fieldErrors.description
              ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-200 bg-white focus:border-sky-500 focus:ring-sky-500/20'
          }`}
        />
        {fieldErrors.description && (
          <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.description}</p>
        )}
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="block text-sm font-semibold text-slate-800">
            Severity Rating (1–10) <span className="text-rose-500">*</span>
          </span>
          {selectedMeta ? (
            <SeverityBadge severity={severity} />
          ) : (
            <span className="text-xs text-slate-500">Select a rating from 1 to 10</span>
          )}
        </div>

        <div
          role="radiogroup"
          aria-label="Severity Rating"
          className="mt-2.5 grid grid-cols-5 gap-2 sm:grid-cols-10"
        >
          {SEVERITY_SCALE.map((level) => {
            const tier = getSeverityMeta(level);
            const isSelected = severity === level;
            return (
              <button
                key={level}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`Severity ${level} (${tier.label})`}
                onClick={() => {
                  setSeverity(level);
                  if (fieldErrors.severity) {
                    setFieldErrors((prev) => ({ ...prev, severity: '' }));
                  }
                }}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition ${
                  isSelected ? tier.pillActiveClass : tier.pillIdleClass
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>

        {fieldErrors.severity && (
          <p className="mt-2 text-xs font-medium text-rose-600">{fieldErrors.severity}</p>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3 sm:grid-cols-4">
          {SEVERITY_TIERS.map((tier) => (
            <div key={tier.label} className="flex items-center gap-2 text-xs text-slate-600">
              <span className={`h-2 w-2 shrink-0 rounded-full ${tier.dotClass}`} />
              <span>
                <strong className="font-semibold text-slate-800">{tier.range}:</strong> {tier.label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Severity labels are interface descriptions for personal tracking, not medical diagnoses.
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Symptom...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Symptom Entry</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
