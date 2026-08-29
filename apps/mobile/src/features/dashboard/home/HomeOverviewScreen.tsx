import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function HomeOverviewScreen() {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>{t("dashboard.home.eyebrow")}</Text>
        <Text style={styles.title}>{t("dashboard.home.title")}</Text>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>
              {t("dashboard.home.upcomingEvents")}
            </Text>
            <Text style={styles.cardValue}>
              {t("dashboard.home.eventsCount", { count: 3 })}
            </Text>
            <Text style={styles.cardHint}>
              {t("dashboard.home.nextMeetup", { time: "18:00" })}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t("dashboard.home.alerts")}</Text>
            <Text style={styles.cardValue}>
              {t("dashboard.home.alertsCount", { count: 2 })}
            </Text>
            <Text style={styles.cardHint}>
              {t("dashboard.home.alertsHint")}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("dashboard.home.summary")}</Text>
          <Text style={styles.sectionText}>
            {t("dashboard.home.summaryText")}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("dashboard.home.forToday")}
          </Text>
          <Text style={styles.mutedText}>{t("dashboard.home.todo1")}</Text>
          <Text style={styles.mutedText}>{t("dashboard.home.todo2")}</Text>
          <Text style={styles.mutedText}>{t("dashboard.home.todo3")}</Text>
        </View>
      </ScrollView>
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
    gap: 20,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: theme.colors.foreground,
  },
  grid: {
    gap: 14,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardLabel: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
    marginBottom: 8,
  },
  cardValue: {
    color: theme.colors.foreground,
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 4,
  },
  cardHint: {
    color: theme.colors.primary,
    fontSize: 12,
  },
  section: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  sectionTitle: {
    color: theme.colors.foreground,
    fontSize: 18,
    fontWeight: "700",
  },
  sectionText: {
    color: theme.colors.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
  },
  mutedText: {
    color: theme.colors.foreground,
    fontSize: 14,
  },
}));
