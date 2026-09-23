import { useState } from "react";
import { Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { SegmentedSwitch } from "@/components";

import { SkillsManagementSegment } from "../components/badges/SkillsManagementSegment";
import { TroopMembersSegment } from "../components/members/TroopMembersSegment";

type TeamTab = "members" | "skills";

export function TeamScreen() {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  const [activeTab, setActiveTab] = useState<TeamTab>("members");

  const isMembersTab = activeTab === "members";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("dashboard.team.members")}</Text>
        <SegmentedSwitch
          activeKey={activeTab}
          onChange={setActiveTab}
          options={[
            { key: "members", label: t("dashboard.team.tabs.members") },
            { key: "skills", label: t("dashboard.team.tabs.skills") },
          ]}
        />
      </View>
      {isMembersTab ? <TroopMembersSegment /> : <SkillsManagementSegment />}
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    paddingBottom: 0,
    gap: 16,
  },
  title: {
    color: theme.colors.foreground,
    fontSize: 26,
    fontWeight: "800",
  },
}));
