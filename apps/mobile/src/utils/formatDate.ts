import { getSafeDate } from "../features/dashboard/meetups/utils/getSafeDate";

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(getSafeDate(value));
}
