import { View, Text } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

function percentage(rate: number | null) {
  return rate === null ? null : Math.round(rate * 100);
}

export function AttendanceProgress({ rate }: { rate: number | null }) {
  const { styles } = useStyles(stylesheet);
  const value = percentage(rate);

  return (
    <View style={styles.progressTrack} accessibilityRole="progressbar">
      <View style={[styles.progressFill, { width: `${value ?? 0}%` }]} />
    </View>
  );
}

export function AttendanceRate({ rate }: { rate: number | null }) {
  const { styles } = useStyles(stylesheet);
  const { t } = useTranslation();
  const value = percentage(rate);

  return (
    <Text style={styles.rate(value)}>
      {value === null ? t("dashboard.meetups.stats.noData") : `${value}%`}
    </Text>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  rate: (value: number | null) => ({
    color: theme.colors.primary,
    fontSize: value !== null ? 20 : 12,
    fontWeight: "800",
  }),
  progressTrack: {
    backgroundColor: theme.colors.muted,
    borderRadius: 99,
    height: 8,
    overflow: "hidden",
    width: "100%",
  },
  progressFill: {
    backgroundColor: theme.colors.primary,
    borderRadius: 99,
    height: "100%",
  },
}));
