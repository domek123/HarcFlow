import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type InventoryTab = "skills" | "equipment";

export function InventoryScreen() {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);
  const [activeTab, setActiveTab] = useState<InventoryTab>("skills");

  const tabOptions = useMemo(
    () => [
      { key: "skills", label: t("dashboard.inventory.tabs.skills") },
      { key: "equipment", label: t("dashboard.inventory.tabs.equipment") },
    ],
    [t],
  );

  const isSkillsTab = activeTab === "skills";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("dashboard.inventory.title")}</Text>

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
                onPress={() => setActiveTab(option.key as InventoryTab)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    selected && styles.segmentTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {isSkillsTab ? (
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>
                {t("dashboard.inventory.skillsTitle")}
              </Text>
              <Text style={styles.panelText}>
                {t("dashboard.inventory.skillsDescription")}
              </Text>
              <View style={styles.listCard}>
                <Text style={styles.listItem}>
                  • {t("dashboard.inventory.skillsList.0")}
                </Text>
                <Text style={styles.listItem}>
                  • {t("dashboard.inventory.skillsList.1")}
                </Text>
                <Text style={styles.listItem}>
                  • {t("dashboard.inventory.skillsList.2")}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>
                {t("dashboard.inventory.equipmentTitle")}
              </Text>
              <Text style={styles.panelText}>
                {t("dashboard.inventory.equipmentDescription")}
              </Text>
              <View style={styles.listCard}>
                <Text style={styles.listItem}>
                  • {t("dashboard.inventory.equipmentList.0")}
                </Text>
                <Text style={styles.listItem}>
                  • {t("dashboard.inventory.equipmentList.1")}
                </Text>
                <Text style={styles.listItem}>
                  • {t("dashboard.inventory.equipmentList.2")}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.foreground,
    marginBottom: 16,
  },
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
  content: {
    paddingBottom: 24,
  },
  panel: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 18,
    padding: 18,
    gap: 12,
  },
  panelTitle: {
    color: theme.colors.foreground,
    fontSize: 22,
    fontWeight: "700",
  },
  panelText: {
    color: theme.colors.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
  },
  listCard: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  listItem: {
    color: theme.colors.foreground,
    fontSize: 14,
  },
}));
