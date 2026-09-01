import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export type InventoryTab = "skills" | "equipment";

interface InventoryTabsProps {
  activeTab: InventoryTab;
  onTabChange: (tab: InventoryTab) => void;
}

export function InventoryTabs({ activeTab, onTabChange }: InventoryTabsProps) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  const tabOptions = useMemo(
    () => [
      { key: "skills", label: t("dashboard.inventory.tabs.skills") },
      { key: "equipment", label: t("dashboard.inventory.tabs.equipment") },
    ],
    [t],
  );

  return (
    <View style={styles.segmentedWrap}>
      {tabOptions.map((option) => {
        const selected = activeTab === option.key;

        return (
          <Pressable
            key={option.key}
            style={[
              styles.segmentButton,
              selected && styles.segmentButtonActive,
            ]}
            onPress={() => onTabChange(option.key as InventoryTab)}
          >
            <Text
              style={[styles.segmentText, selected && styles.segmentTextActive]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  segmentedWrap: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  segmentText: {
    color: theme.colors.mutedForeground,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  segmentTextActive: {
    color: theme.colors.primaryForeground,
  },
}));
