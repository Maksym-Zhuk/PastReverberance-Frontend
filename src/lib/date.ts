const pad = (n: number) => String(n).padStart(2, '0');

// local calendar day as YYYY-MM-DD (toISOString would shift it to UTC)
export const todayLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// photos store either a bare day or a full ISO string; show the calendar day
export const formatDate = (value: string) => {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return value;
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
