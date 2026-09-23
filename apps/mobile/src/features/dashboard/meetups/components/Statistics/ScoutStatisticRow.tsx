import { View, Text } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { AttendanceStatistics } from "@harcapp/types";

import { AttendanceRate } from "./AttendanceProgress";

type ScoutStatistics =
  AttendanceStatistics["patrols"][number]["members"][number];

export function ScoutStatisticsRow({ member }: { member: ScoutStatistics }) {
  const { styles } = useStyles(stylesheet);
  const { t } = useTranslation();

  return (
    <View style={styles.memberRow}>
      <View style={styles.memberDetails}>
        <Text style={styles.memberName}>
          {member.firstName} {member.lastName}
        </Text>
        <Text style={styles.memberSummary}>
          {t("dashboard.meetups.stats.memberSummary", {
            present: member.present,
            absent: member.absent,
            excused: member.excused,
          })}
        </Text>
      </View>
      <AttendanceRate rate={member.attendanceRate} />
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  memberRow: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
  },
  memberDetails: { flex: 1, gap: 3 },
  memberName: {
    color: theme.colors.foreground,
    fontSize: 15,
    fontWeight: "700",
  },
  memberSummary: { color: theme.colors.mutedForeground, fontSize: 12 },
}));
