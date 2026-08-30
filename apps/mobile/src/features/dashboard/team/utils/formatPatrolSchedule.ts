export const formatPatrolSchedule = (
  day: number | null,
  time: string | null,
  t: (key: string) => string,
) => {
  const dayLabel = day ? t(`dashboard.team.weekdays.${day}`) : "-";

  if (!day && !time) {
    return t("dashboard.team.unassigned");
  }

  return `${dayLabel}, ${time || "-"}`;
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
