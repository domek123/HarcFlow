import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { supabase } from "@lib/supabase";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useFetchCurrentScoutProfile } from "@harcapp/api-client";

import { AppearanceScreen } from "./components/AppearanceModal";
import { InfoRow } from "./components/InfoRow";
import { ProfileAction } from "./components/ProfileAction";
import { useLogout } from "./hooks/useLogout";

export function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { styles } = useStyles(stylesheet);
  const [isAppearanceVisible, setAppearanceVisible] = useState(false);
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useFetchCurrentScoutProfile(supabase);

  const { logout, isLoading: isLoginOut } = useLogout();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>{t("common.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateContainer}>
          <Text style={styles.stateTitle}>
            {t("dashboard.profile.loadError")}
          </Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>{t("common.retry")}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(
    0,
  )}`.toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("dashboard.profile.title")}</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileHeading}>
            <Text style={styles.name}>
              {profile.firstName} {profile.lastName}
            </Text>
            <Text style={styles.role}>
              {t(`enums.function.${profile.function}`)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("dashboard.profile.information")}
          </Text>
          <InfoRow
            label={t("dashboard.profile.function")}
            value={t(`enums.function.${profile.function}`)}
          />
          <InfoRow
            label={t("dashboard.profile.degree")}
            value={t(`enums.degree.${profile.degree}`)}
          />
          <InfoRow
            label={t("dashboard.profile.rank")}
            value={t(`enums.rank.${profile.rank}`)}
          />
          {profile.patrolId && (
            <InfoRow
              label={t("dashboard.profile.patrol")}
              value={profile.patrol?.name ?? t("dashboard.profile.noPatrol")}
            />
          )}
        </View>

        <View style={styles.section}>
          <ProfileAction
            icon="person-outline"
            label={t("dashboard.profile.myData")}
            onPress={() => router.push("/my-data")}
          />
          <ProfileAction
            icon="notifications-outline"
            label={t("dashboard.profile.notifications")}
          />
          <ProfileAction
            icon="color-palette-outline"
            label={t("dashboard.profile.appearance")}
            onPress={() => setAppearanceVisible(true)}
          />
        </View>

        <View style={styles.section}>
          <ProfileAction
            icon="lock-closed-outline"
            label={t("dashboard.profile.security")}
          />
          <ProfileAction
            icon="log-out-outline"
            label={t("dashboard.profile.logout")}
            danger
            onPress={logout}
            disabled={isLoginOut}
          />
        </View>
      </ScrollView>
      <AppearanceScreen
        visible={isAppearanceVisible}
        onClose={() => setAppearanceVisible(false)}
      />
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
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: theme.colors.foreground,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: theme.colors.primary,
    borderRadius: 18,
    padding: 18,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primaryForeground,
  },
  avatarText: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: "800",
  },
  profileHeading: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: theme.colors.primaryForeground,
    fontSize: 20,
    fontWeight: "800",
  },
  role: {
    color: theme.colors.primaryForeground,
    fontSize: 14,
    opacity: 0.8,
  },
  section: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionTitle: {
    color: theme.colors.foreground,
    fontSize: 16,
    fontWeight: "800",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  stateText: {
    color: theme.colors.mutedForeground,
    fontSize: 15,
  },
  stateTitle: {
    color: theme.colors.foreground,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: theme.colors.primaryForeground,
    fontWeight: "700",
  },
}));
