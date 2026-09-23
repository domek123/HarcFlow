import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useCurrentTroopId } from "@/hooks";
import { useTroopAttendanceStatistics } from "@harcapp/api-client";

import { PatrolAccordion } from "./PatrolAccordion";
import { ScoutStatisticsRow } from "./ScoutStatisticRow";
import { TroopStatisticsCard } from "./TroopStatisticsCard";

export function MeetupsStats() {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);
  const {
    troopId,
    isLoading: isTroopLoading,
    error: troopError,
  } = useCurrentTroopId();

  const { data, isLoading, isError, refetch } =
    useTroopAttendanceStatistics(troopId);

  const [expandedPatrolIds, setExpandedPatrolIds] = useState<string[]>([]);

  if (isTroopLoading || isLoading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color={styles.loader.color} />
      </View>
    );
  }

  if (troopError || isError) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>
          {t("dashboard.meetups.stats.loadError")}
        </Text>
        <Pressable style={styles.retryButton} onPress={() => void refetch()}>
          <Text style={styles.retryText}>{t("common.retry")}</Text>
        </Pressable>
      </View>
    );
  }

  if (!data || data.troop.totalEvents === 0) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>
          {t("dashboard.meetups.stats.empty")}
        </Text>
      </View>
    );
  }

  const cadre = data.patrols.find((patrol) => patrol.id === "kadra");
  const unassigned = data.patrols.find((patrol) => patrol.id === "unassigned");
  const patrols = data.patrols.filter(
    (patrol) => patrol.id !== "kadra" && patrol.id !== "unassigned",
  );
  const togglePatrol = (patrolId: string) => {
    setExpandedPatrolIds((current) =>
      current.includes(patrolId)
        ? current.filter((id) => id !== patrolId)
        : [...current, patrolId],
    );
  };
  const sortedUnassigned = [...(unassigned?.members ?? [])].sort(
    (left, right) =>
      `${left.lastName} ${left.firstName}`.localeCompare(
        `${right.lastName} ${right.firstName}`,
        "pl",
      ),
  );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TroopStatisticsCard statistics={data.troop} />
      {cadre && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("dashboard.meetups.stats.cadre")}
          </Text>
          <PatrolAccordion
            patrol={cadre}
            expanded={expandedPatrolIds.includes(cadre.id)}
            onToggle={() => togglePatrol(cadre.id)}
          />
        </View>
      )}
      {patrols.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("dashboard.meetups.stats.patrols")}
          </Text>
          {patrols.map((patrol) => (
            <PatrolAccordion
              key={patrol.id}
              patrol={patrol}
              expanded={expandedPatrolIds.includes(patrol.id)}
              onToggle={() => togglePatrol(patrol.id)}
            />
          ))}
        </View>
      )}
      {sortedUnassigned.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("dashboard.meetups.stats.unassigned")}
          </Text>
          <View style={styles.memberList}>
            {sortedUnassigned.map((member) => (
              <ScoutStatisticsRow key={member.id} member={member} />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  content: { gap: 16, paddingBottom: 100 },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metric: { minWidth: "45%", flex: 1, gap: 2 },
  metricValue: {
    color: theme.colors.foreground,
    fontSize: 18,
    fontWeight: "800",
  },
  metricLabel: { color: theme.colors.mutedForeground, fontSize: 12 },
  section: { gap: 10 },
  sectionTitle: {
    color: theme.colors.foreground,
    fontSize: 20,
    fontWeight: "800",
  },
  memberList: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingHorizontal: 14,
  },
  stateContainer: {
    alignItems: "center",
    flex: 1,
    gap: 12,
    justifyContent: "center",
  },
  stateText: {
    color: theme.colors.mutedForeground,
    padding: 12,
    textAlign: "center",
  },
  loader: { color: theme.colors.primary },
  retryButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryText: { color: theme.colors.secondaryForeground, fontWeight: "700" },
}));
