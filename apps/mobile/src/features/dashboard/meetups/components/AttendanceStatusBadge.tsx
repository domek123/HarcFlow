import { Text } from "react-native";

import { AttendanceStatus } from "@harcapp/types";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  label: string;
}

export function AttendanceStatusBadge({
  status,
  label,
}: AttendanceStatusBadgeProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Text
      style={[
        styles.badge,
        styles[status.toLowerCase() as Lowercase<AttendanceStatus>],
      ]}
    >
      {label}
    </Text>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  badge: {
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  present: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.primaryForeground,
  },
  excused: {
    backgroundColor: theme.colors.secondary,
    color: theme.colors.secondaryForeground,
  },
  absent: {
    backgroundColor: theme.colors.muted,
    color: theme.colors.foreground,
  },
}));
