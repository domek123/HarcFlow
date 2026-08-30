export const formatPatrolSchedule = (
  day: number,
  time: string,
  t: (key: string) => string,
) => {
  const safeDay = Math.min(7, Math.max(1, Number(day) || 1));
  const dayLabel = t(`dashboard.team.weekdays.${safeDay}`);

  return `${dayLabel}, ${time}`;
};

export const parseTimeToDate = (value?: string) => {
  const [hours = 18, minutes = 0] = (value ?? "18:00")
    .split(":")
    .map((part) => Number(part) || 0);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date;
};

export const formatTimeValue = (value: Date) =>
  value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
