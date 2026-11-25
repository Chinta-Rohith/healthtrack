/**
 * Formats an ISO-8601 UTC timestamp into the user's local readable date.
 */
export function formatDate(isoTimestamp) {
  if (!isoTimestamp) return '—';
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats an ISO-8601 UTC timestamp into the user's local readable time.
 */
export function formatTime(isoTimestamp) {
  if (!isoTimestamp) return '—';
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatDateTime(isoTimestamp) {
  if (!isoTimestamp) return '—';
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

/**
 * Parses a YYYY-MM-DD calendar date safely without UTC-to-local day shift.
 */
function parseCalendarDate(dateString) {
  if (!dateString) return null;
  const parts = dateString.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export function formatTrendAxisDate(dateString) {
  const date = parseCalendarDate(dateString);
  if (!date) return dateString ?? '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatTrendTooltipDate(dateString) {
  const date = parseCalendarDate(dateString);
  if (!date) return dateString ?? '';
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}
