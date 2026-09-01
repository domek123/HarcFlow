import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { supabase } from "@/lib/supabase";
import {
  useFetchScoutNotes,
  useFetchScoutProfile,
  useFetchUserParents,
} from "@harcapp/api-client";

import { MemberContactSection } from "../components/member-details/MemberContactSection";
import { MemberNotesSection } from "../components/member-details/MemberNotesSection";
import { MemberParentsSection } from "../components/member-details/MemberParentsSection";
import { MemberPersonalInfoSection } from "../components/member-details/MemberPersonalInfoSection";

export function MemberDetailsScreen() {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);
  const { memberId } = useLocalSearchParams<{ memberId: string }>();

  const { data: member, isLoading: isMemberLoading } = useFetchScoutProfile(
    supabase,
    memberId,
  );
  const { data: parents, isLoading: isParentsLoading } = useFetchUserParents(
    supabase,
    member?.userId,
  );
  const { data: notes, isLoading: isNotesLoading } = useFetchScoutNotes(
    supabase,
    memberId,
  );

  const isLoading = isMemberLoading || isParentsLoading || isNotesLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={20}
              color={styles.backIcon.color}
            />
            <Text style={styles.backText}>
              {t("dashboard.memberDetails.back")}
            </Text>
          </Pressable>
          <Text style={styles.title}>{t("dashboard.memberDetails.title")}</Text>
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={styles.loader.color} />
          </View>
        ) : (
          <>
            <MemberPersonalInfoSection member={member!} />
            <MemberContactSection member={member!} />
            <MemberParentsSection parents={parents!} userId={member!.userId} />
            <MemberNotesSection notes={notes!} profileId={memberId} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  topBar: { gap: 12 },
  backButton: { flexDirection: "row", alignItems: "center", gap: 6 },
  backIcon: { color: theme.colors.primary },
  backText: { color: theme.colors.primary, fontWeight: "700" },
  title: { color: theme.colors.foreground, fontSize: 26, fontWeight: "800" },
  loaderContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  loader: { color: theme.colors.primary },
}));
