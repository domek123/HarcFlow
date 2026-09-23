import { Pressable, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type ProfileActionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  danger?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export function ProfileAction({
  icon,
  label,
  danger = false,
  disabled = false,
  onPress,
}: ProfileActionProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.action, danger && styles.dangerAction]}
      disabled={disabled}
    >
      <Ionicons
        name={icon}
        size={20}
        color={danger ? styles.dangerIcon.color : styles.actionIcon.color}
      />
      <Text style={danger ? styles.dangerLabel : styles.actionLabel}>
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={danger ? styles.dangerIcon.color : styles.chevron.color}
      />
    </Pressable>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 16,
    opacity: 0.9,
  },
  dangerAction: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
  },
  actionIcon: {
    color: theme.colors.primary,
  },
  chevron: {
    color: theme.colors.mutedForeground,
  },
  actionLabel: {
    color: theme.colors.foreground,
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  dangerIcon: {
    color: theme.colors.destructive,
  },
  dangerLabel: {
    color: theme.colors.destructive,
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
}));
