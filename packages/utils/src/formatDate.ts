import { getSafeDate } from "./getSafeDate";

export function formatDate(value?: string | null): string {
  return value
    ? new Intl.DateTimeFormat("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(getSafeDate(value))
    : "-";
}
