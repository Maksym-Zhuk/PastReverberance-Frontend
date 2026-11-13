import { format } from 'date-fns';

// stored values are either a bare day (YYYY-MM-DD, legacy) or a full ISO string
const BARE_DAY = /^\d{4}-\d{2}-\d{2}$/;

// bare days are local midnight, ISO strings keep their instant
export const parseDate = (value: string) => {
  if (BARE_DAY.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
};

// short month name reads faster than dd/MM and avoids day/month mix-ups
export const DATE_FORMAT = 'd MMM yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATE_TIME_FORMAT = `${DATE_FORMAT}, ${TIME_FORMAT}`;

// "14 Nov 2026"
export const formatDate = (value: string) => {
  const d = parseDate(value);
  return Number.isNaN(d.getTime()) ? value : format(d, DATE_FORMAT);
};

// "18:32"; legacy bare days have no time, so null
export const formatTime = (value: string) => {
  const d = parseDate(value);
  return BARE_DAY.test(value) || Number.isNaN(d.getTime())
    ? null
    : format(d, TIME_FORMAT);
};

// "14 Nov 2026, 18:32" (just the date for legacy bare days)
export const formatDateTime = (value: string) => {
  const time = formatTime(value);
  return time ? `${formatDate(value)}, ${time}` : formatDate(value);
};
