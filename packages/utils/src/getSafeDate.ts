export function getSafeDate(value: string | Date, fallback = new Date()): Date {
  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? fallback : date;
}
