export const PATIENT_ID_REGEX = /^[A-Za-z0-9_-]{1,50}$/;
export const MAX_DESCRIPTION_LENGTH = 500;
export const DEMO_PATIENT_ID = 'PATIENT001';

export const SEVERITY_TIERS = [
  {
    range: '1–3',
    label: 'Mild',
    description: 'Noticeable but minimally disruptive to daily activities.',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    dotClass: 'bg-teal-500',
    pillActiveClass: 'bg-teal-600 text-white border-teal-600 shadow-sm',
    pillIdleClass: 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50/60',
  },
  {
    range: '4–6',
    label: 'Moderate',
    description: 'Present consistently and may require rest or pacing.',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
    pillActiveClass: 'bg-amber-500 text-white border-amber-500 shadow-sm',
    pillIdleClass: 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/60',
  },
  {
    range: '7–8',
    label: 'High',
    description: 'Marked discomfort that noticeably limits routine tasks.',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    dotClass: 'bg-orange-500',
    pillActiveClass: 'bg-orange-500 text-white border-orange-500 shadow-sm',
    pillIdleClass: 'bg-white text-slate-700 border-slate-200 hover:border-orange-300 hover:bg-orange-50/60',
  },
  {
    range: '9–10',
    label: 'Severe',
    description: 'Intense discomfort; consider consulting a healthcare professional.',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500',
    pillActiveClass: 'bg-rose-600 text-white border-rose-600 shadow-sm',
    pillIdleClass: 'bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:bg-rose-50/60',
  },
];

export function getSeverityMeta(severity) {
  const numeric = Number(severity);
  if (numeric <= 3) return SEVERITY_TIERS[0];
  if (numeric <= 6) return SEVERITY_TIERS[1];
  if (numeric <= 8) return SEVERITY_TIERS[2];
  return SEVERITY_TIERS[3];
}

export function isValidSeverity(value) {
  const num = Number(value);
  return Number.isInteger(num) && num >= 1 && num <= 10;
}

export function validatePatientId(value) {
  const trimmed = (value ?? '').trim();
  if (!trimmed) {
    return 'Patient ID is required.';
  }
  if (!PATIENT_ID_REGEX.test(trimmed)) {
    return 'Patient ID must be 1–50 characters using letters, numbers, hyphens, or underscores.';
  }
  return '';
}
