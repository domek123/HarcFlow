import { useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { SkillsManagementSegment } from "../components/badges/SkillsManagementSegment";
import { useTeamScreen } from "../hooks/useTeamScreen";
import { TroopMembersSegment } from "./TroopMembersSegment";

type TeamTab = "members" | "skills";

export function TeamScreen() {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  const teamData = useTeamScreen();
  const { troop, totalMembers, refreshing, onRefresh } = teamData;

  const [activeTab, setActiveTab] = useState<TeamTab>("members");

  const tabOptions = useMemo(
    () => [
      { key: "members", label: t("dashboard.team.tabs.members") },
      { key: "skills", label: t("dashboard.team.tabs.skills") },
    ],
    [t],
  );

  const isMembersTab = activeTab === "members";

  const header = (
    <View style={styles.headerCard}>
      <View style={styles.headerTopRow}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>
            {troop?.name ?? t("dashboard.team.defaultName")}
          </Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryMiniCard}>
          <Text style={styles.summaryLabel}>{t("dashboard.team.members")}</Text>
          <Text style={styles.summaryValue}>{totalMembers}</Text>
        </View>
      </View>
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
              onPress={() => setActiveTab(option.key as TeamTab)}
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
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {isMembersTab ? (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }
        >
          {header}
          <TroopMembersSegment {...teamData} />
        </ScrollView>
      ) : (
        <View style={styles.skillsScreen}>
          {header}
          <SkillsManagementSegment />
        </View>
      )}
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  skillsScreen: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  headerCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    gap: 12,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    color: theme.colors.foreground,
    fontSize: 26,
    fontWeight: "800",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  summaryMiniCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  summaryLabel: {
    color: theme.colors.mutedForeground,
    fontSize: 11,
    marginBottom: 4,
  },
  summaryValue: {
    color: theme.colors.foreground,
    fontSize: 22,
    fontWeight: "800",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionPrimary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  actionSecondary: {
    backgroundColor: "transparent",
    borderColor: theme.colors.border,
  },
  actionButtonText: {
    color: theme.colors.foreground,
    fontSize: 14,
    fontWeight: "700",
  },
  addScoutButtonText: {
    color: theme.colors.secondary,
  },
  segmentedWrap: {
    flexDirection: "row",
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    padding: 4,
    marginTop: 2,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  segmentText: {
    color: theme.colors.mutedForeground,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  segmentTextActive: {
    color: theme.colors.foreground,
    fontWeight: "700",
  },
  searchBox: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    color: theme.colors.foreground,
    fontSize: 14,
  },
  placeholder: {
    color: theme.colors.mutedForeground,
  },
  section: {
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    gap: 10,
  },
  sectionTitle: {
    color: theme.colors.foreground,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  emptyText: {
    color: theme.colors.mutedForeground,
    fontSize: 13,
  },
  loadingText: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
    textAlign: "center",
  },
  skillsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    gap: 12,
  },
  skillsTitle: {
    color: theme.colors.foreground,
    fontSize: 22,
    fontWeight: "800",
  },
  skillsText: {
    color: theme.colors.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
  },
}));
