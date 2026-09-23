import { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { SegmentedSwitch } from "@/components";

import { SkillsManagementSegment } from "../components/badges/SkillsManagementSegment";
import { TroopMembersSegment } from "../components/members/TroopMembersSegment";
import { useTeamScreen } from "../hooks/useTeamScreen";

type TeamTab = "members" | "skills";

export function TeamScreen() {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  const teamData = useTeamScreen();
  const { refreshing, onRefresh } = teamData;

  const [activeTab, setActiveTab] = useState<TeamTab>("members");

  const isMembersTab = activeTab === "members";

  const header = (
    <>
      <Text style={styles.title}>{t("dashboard.team.members")}</Text>
      <SegmentedSwitch
        activeKey={activeTab}
        onChange={setActiveTab}
        options={[
          { key: "members", label: t("dashboard.team.tabs.members") },
          { key: "skills", label: t("dashboard.team.tabs.skills") },
        ]}
      />
    </>
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
  title: {
    color: theme.colors.foreground,
    fontSize: 26,
    fontWeight: "800",
  },
}));
