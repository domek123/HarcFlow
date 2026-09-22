import { useMemo } from "react";
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

import { useCurrentTroopId } from "@/hooks";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/utils/toast";
import { useTroopMembersAttendance } from "@harcapp/api-client";
import { AttendanceStatus } from "@harcapp/types";

import { AttendanceMemberRow } from "./components/AttendanceMemberRow";
import { useAttendanceEditor } from "./hooks/useAttendanceEditor";

const statusOrder: Record<AttendanceStatus, number> = {
  [AttendanceStatus.PRESENT]: 0,
  [AttendanceStatus.EXCUSED]: 1,
  [AttendanceStatus.ABSENT]: 2,
};

export function AttendanceScreen() {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(stylesheet);
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { troopId } = useCurrentTroopId();
  const {
    data: members,
    isLoading,
    isError,
    refetch,
  } = useTroopMembersAttendance(supabase, troopId, eventId);
  const editor = useAttendanceEditor(members, eventId);

  const getStatusLabel = (status: AttendanceStatus) =>
    t(
      `dashboard.meetups.attendance.status${status[0]}${status.slice(1).toLowerCase()}`,
    );

  const sortedMembers = useMemo(() => {
    if (!members) return [];
    return members.sort((a, b) => {
      const aStatus = editor.getStatus(a);
      const bStatus = editor.getStatus(b);
      return (
        (aStatus ? statusOrder[aStatus] : 3) -
        (bStatus ? statusOrder[bStatus] : 3)
      );
    });
  }, [editor, members]);

  const presentCount = (members ?? []).filter(
    (member) => editor.getStatus(member) === AttendanceStatus.PRESENT,
  ).length;

  const handleSave = async () => {
    try {
      await editor.mutation.mutateAsync();
      editor.cancelEditing();
      showToast.success(t("dashboard.meetups.attendance.saveSuccess"));
    } catch (error) {
      console.error("Błąd zapisywania listy obecności:", error);
      showToast.error(t("dashboard.meetups.attendance.saveError"));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.backText}>
              {t("dashboard.meetups.attendance.back")}
            </Text>
          </Pressable>
          <View style={styles.titleRow}>
            <View style={styles.heading}>
              <Text style={styles.title}>
                {t(
                  editor.isEditing
                    ? "dashboard.meetups.attendance.editTitle"
                    : "dashboard.meetups.attendance.title",
                )}
              </Text>
              <Text style={styles.subtitle}>
                {t("dashboard.meetups.attendance.summary", {
                  present: presentCount,
                  total: members?.length ?? 0,
                })}
              </Text>
            </View>
            <Pressable
              accessibilityLabel={t(
                editor.isEditing
                  ? "dashboard.meetups.attendance.cancelEdit"
                  : "dashboard.meetups.attendance.edit",
              )}
              accessibilityRole="button"
              style={styles.editButton}
              onPress={() =>
                editor.isEditing
                  ? editor.cancelEditing()
                  : editor.startEditing()
              }
            >
              <Ionicons
                name={editor.isEditing ? "close" : "pencil"}
                size={20}
                color={theme.colors.primary}
              />
            </Pressable>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : isError ? (
          <View style={styles.stateContainer}>
            <Text style={styles.empty}>
              {t("dashboard.meetups.attendance.loadError")}
            </Text>
            <Pressable
              style={styles.retryButton}
              onPress={() => void refetch()}
            >
              <Text style={styles.retryText}>{t("common.retry")}</Text>
            </Pressable>
          </View>
        ) : sortedMembers.length ? (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {editor.isEditing && (
              <View style={styles.quickActions}>
                <Pressable
                  style={styles.quickAction}
                  onPress={() =>
                    editor.setAllStatuses(AttendanceStatus.PRESENT)
                  }
                >
                  <Text style={styles.quickActionText}>
                    {t("dashboard.meetups.attendance.markAllPresent")}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.quickAction}
                  onPress={() => editor.setAllStatuses(AttendanceStatus.ABSENT)}
                >
                  <Text style={styles.quickActionText}>
                    {t("dashboard.meetups.attendance.markAllAbsent")}
                  </Text>
                </Pressable>
              </View>
            )}
            {sortedMembers.map((member) => (
              <AttendanceMemberRow
                key={member.id}
                member={member}
                status={editor.getStatus(member)}
                isEditing={editor.isEditing}
                getStatusLabel={getStatusLabel}
                onStatusChange={(status) => editor.setStatus(member.id, status)}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.stateContainer}>
            <Text style={styles.empty}>
              {t("dashboard.meetups.attendance.empty")}
            </Text>
            {!editor.isEditing && (
              <Text style={styles.hint}>
                {t("dashboard.meetups.attendance.noDataHint")}
              </Text>
            )}
          </View>
        )}

        {editor.isEditing && (
          <Pressable
            disabled={editor.mutation.isPending || !members?.length}
            onPress={() => void handleSave()}
            style={[
              styles.saveButton,
              (editor.mutation.isPending || !members?.length) &&
                styles.disabledButton,
            ]}
          >
            {editor.mutation.isPending ? (
              <ActivityIndicator color={theme.colors.primaryForeground} />
            ) : (
              <Text style={styles.saveButtonText}>
                {t("dashboard.meetups.attendance.save", {
                  count: members?.length ?? 0,
                })}
              </Text>
            )}
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, gap: 18, padding: 20 },
  header: { gap: 12 },
  backButton: { alignItems: "center", flexDirection: "row", gap: 6 },
  backText: { color: theme.colors.primary, fontWeight: "700" },
  titleRow: { alignItems: "center", flexDirection: "row", gap: 12 },
  heading: { flex: 1, gap: 4 },
  title: { color: theme.colors.foreground, fontSize: 26, fontWeight: "800" },
  subtitle: { color: theme.colors.mutedForeground, fontSize: 14 },
  editButton: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: 10,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  content: { gap: 10, paddingBottom: 12 },
  stateContainer: {
    alignItems: "center",
    flex: 1,
    gap: 12,
    justifyContent: "center",
  },
  empty: {
    color: theme.colors.mutedForeground,
    padding: 12,
    textAlign: "center",
  },
  hint: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryText: { color: theme.colors.secondaryForeground, fontWeight: "700" },
  quickActions: { flexDirection: "row", gap: 8 },
  quickAction: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: 8,
  },
  quickActionText: {
    color: theme.colors.secondaryForeground,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    justifyContent: "center",
    minHeight: 50,
  },
  disabledButton: { opacity: 0.5 },
  saveButtonText: {
    color: theme.colors.primaryForeground,
    fontSize: 16,
    fontWeight: "700",
  },
}));
