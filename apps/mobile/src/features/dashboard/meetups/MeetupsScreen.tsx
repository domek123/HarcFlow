import { useState } from "react";
import { Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { SegmentedSwitch } from "@/components";

import { EventSegment } from "./components/events/EventSegment";
import { MeetupsStats } from "./components/statistics/MeetupsStats";

type MeetupsTab = "calendar" | "stats";

export function MeetupsScreen() {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);
  const [activeTab, setActiveTab] = useState<MeetupsTab>("calendar");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.heading}>
            <Text style={styles.title}>{t("dashboard.meetups.title")}</Text>
            <Text style={styles.subtitle}>
              {t("dashboard.meetups.subtitle")}
            </Text>
          </View>
        </View>
        <SegmentedSwitch
          activeKey={activeTab}
          options={[
            { key: "calendar", label: t("dashboard.meetups.calendarTab") },
            { key: "stats", label: t("dashboard.meetups.statsTab") },
          ]}
          onChange={setActiveTab}
        />
        {activeTab === "calendar" ? <EventSegment /> : <MeetupsStats />}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  heading: { flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.mutedForeground,
  },
}));
