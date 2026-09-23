import { View, Text } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { AttendanceStatistics } from "@harcapp/types";

import { AttendanceRate, AttendanceProgress } from "./AttendanceProgress";

type Statistics = AttendanceStatistics["troop"];

export function TroopStatisticsCard({
  statistics,
}: {
  statistics: Statistics;
}) {
  const { styles } = useStyles(stylesheet);
  const { t } = useTranslation();

  return (
    <View style={styles.troopCard}>
      <Text style={styles.cardTitle}>{t("dashboard.meetups.stats.troop")}</Text>
      <View style={styles.troopRateRow}>
        <AttendanceRate rate={statistics.attendanceRate} />
        <Text style={styles.eventCount}>
          {t("dashboard.meetups.stats.eventCount", {
            count: statistics.totalEvents,
          })}
        </Text>
      </View>
      <AttendanceProgress rate={statistics.attendanceRate} />
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  troopCard: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.primary,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
    padding: 18,
  },
  cardTitle: {
    color: theme.colors.foreground,
    fontSize: 18,
    fontWeight: "800",
  },
  troopRateRow: { alignItems: "baseline", flexDirection: "row", gap: 10 },
  eventCount: { color: theme.colors.mutedForeground, fontSize: 13 },
}));
