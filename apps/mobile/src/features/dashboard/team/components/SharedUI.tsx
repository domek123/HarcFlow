import React from "react";
import { Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function DetailRow({ label, value }: { label: string; value?: string }) {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );
}

export function ActionRow({ children }: { children: React.ReactNode }) {
  const { styles } = useStyles(stylesheet);
  return <View style={styles.actionRow}>{children}</View>;
}

export function ActionButton({
  label,
  icon,
  onPress,
  danger = false,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  danger?: boolean;
}) {
  const { styles } = useStyles(stylesheet);
  return (
    <Pressable
      style={[styles.actionButton, danger && styles.dangerButton]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={15}
        color={danger ? styles.dangerText.color : styles.actionText.color}
      />
      <Text style={danger ? styles.dangerText : styles.actionText}>
        {label}
      </Text>
    </Pressable>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 3,
  },
  label: { color: theme.colors.mutedForeground, fontSize: 13, flex: 1 },
  value: {
    color: theme.colors.foreground,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  actionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  dangerButton: { borderColor: theme.colors.destructive },
  actionText: { color: theme.colors.primary, fontSize: 12, fontWeight: "700" },
  dangerText: {
    color: theme.colors.destructive,
    fontSize: 12,
    fontWeight: "700",
  },
}));
