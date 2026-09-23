import { View, Pressable, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { AttendanceStatistics } from "@harcapp/types";

import { AttendanceRate, AttendanceProgress } from "./AttendanceProgress";
import { ScoutStatisticsRow } from "./ScoutStatisticRow";

export function PatrolAccordion({
  patrol,
  expanded,
  onToggle,
}: {
  patrol: AttendanceStatistics["patrols"][number];
  expanded: boolean;
  onToggle: () => void;
}) {
  const { styles } = useStyles(stylesheet);
  const { t } = useTranslation();
  const sortedMembers = [...patrol.members].sort((left, right) =>
    `${left.lastName} ${left.firstName}`.localeCompare(
      `${right.lastName} ${right.firstName}`,
      "pl",
    ),
  );

  return (
    <View style={styles.accordion}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={onToggle}
        style={styles.accordionHeader}
      >
        <View style={styles.accordionTitleRow}>
          <Text style={styles.patrolName}>{patrol.name}</Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={styles.icon.color}
          />
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            {t("dashboard.meetups.stats.attendance")}
          </Text>
          <AttendanceRate rate={patrol.attendanceRate} />
        </View>
        <AttendanceProgress rate={patrol.attendanceRate} />
        <Text style={styles.memberCount}>
          {t("dashboard.meetups.stats.memberCount", {
            count: patrol.members.length,
          })}
        </Text>
      </Pressable>
      {expanded && (
        <View style={styles.memberList}>
          {sortedMembers.map((member) => (
            <ScoutStatisticsRow key={member.id} member={member} />
          ))}
        </View>
      )}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  accordion: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  accordionHeader: { gap: 10, padding: 14 },
  accordionTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  patrolName: {
    color: theme.colors.foreground,
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
  },
  icon: { color: theme.colors.mutedForeground },
  summaryRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: { color: theme.colors.mutedForeground, fontSize: 13 },
  memberCount: { color: theme.colors.mutedForeground, fontSize: 12 },
  memberList: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingHorizontal: 14,
  },
}));
