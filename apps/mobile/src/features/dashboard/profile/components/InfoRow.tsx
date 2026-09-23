import { View, Text } from "react-native";

import { createStyleSheet, useStyles } from "react-native-unistyles";

type InfoRowProps = { label: string; value: string };

export function InfoRow({ label, value }: InfoRowProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  infoLabel: {
    color: theme.colors.mutedForeground,
    flex: 1,
    fontSize: 14,
  },
  infoValue: {
    color: theme.colors.foreground,
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
  },
}));
