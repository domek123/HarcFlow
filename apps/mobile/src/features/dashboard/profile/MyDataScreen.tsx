import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { supabase } from "@/lib/supabase";
import { useFetchCurrentScoutProfile } from "@harcapp/api-client";
import { formatDate } from "@harcapp/utils";

export function MyDataScreen() {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);
  const router = useRouter();

  const { data: profile, isLoading } = useFetchCurrentScoutProfile(supabase);

  if (isLoading || !profile) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel={t("dashboard.myData.back")}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
          <Text style={styles.title}>{t("dashboard.myData.title")}</Text>
        </View>

        <DataSection title={t("dashboard.myData.personalData")} styles={styles}>
          <ValueRow
            label={t("dashboard.myData.firstName")}
            value={profile.firstName}
            styles={styles}
          />
          <ValueRow
            label={t("dashboard.myData.lastName")}
            value={profile.lastName}
            styles={styles}
          />

          <ValueRow
            label={t("dashboard.myData.birthDate")}
            value={profile.birthDate && formatDate(profile.birthDate)}
            styles={styles}
          />
          <ValueRow
            label={t("dashboard.myData.gender")}
            value={t(`enums.gender.${profile.gender}`)}
            styles={styles}
          />
        </DataSection>

        <DataSection title={t("dashboard.myData.contact")} styles={styles}>
          <ValueRow
            label={t("dashboard.myData.email")}
            value={profile.email}
            styles={styles}
          />

          <ValueRow
            label={t("dashboard.myData.phoneNumber")}
            value={profile.phoneNumber}
            styles={styles}
          />
        </DataSection>
      </ScrollView>
    </SafeAreaView>
  );
}

function DataSection({
  title,
  children,
  styles,
}: {
  title: string;
  children: React.ReactNode;
  styles: ReturnType<typeof useStyles<typeof stylesheet>>["styles"];
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ValueRow({
  label,
  value,
  styles,
  readOnly = false,
}: {
  label: string;
  value?: string;
  styles: ReturnType<typeof useStyles<typeof stylesheet>>["styles"];
  readOnly?: boolean;
}) {
  return (
    <View style={styles.valueRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} selectable={!!value}>
        {value || "-"}
      </Text>
      {readOnly ? <Text style={styles.readOnly}> •</Text> : null}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: theme.colors.foreground,
    fontSize: 34,
    lineHeight: 34,
  },
  title: {
    flex: 1,
    color: theme.colors.foreground,
    fontSize: 26,
    fontWeight: "800",
  },
  section: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 4,
  },
  sectionTitle: {
    color: theme.colors.foreground,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    gap: 12,
  },
  label: {
    color: theme.colors.mutedForeground,
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
  },
  value: {
    color: theme.colors.foreground,
    flex: 1.35,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "right",
  },
  readOnly: { color: theme.colors.mutedForeground, fontSize: 12 },
}));
