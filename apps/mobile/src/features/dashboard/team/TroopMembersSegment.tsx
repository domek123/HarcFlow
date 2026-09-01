import { useState } from "react";
import { View, Pressable, TextInput, Text } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { AddMemberModal } from "./components/AddMemberModal";
import { AddPatrolModal } from "./components/AddPatrolModal";
import { MemberItem } from "./components/MemberItem";
import { PatrolSection } from "./components/PatrolSection";
import { useTeamScreen } from "./hooks/useTeamScreen";

type TroopMembersSegmentProps = ReturnType<typeof useTeamScreen>;

export const TroopMembersSegment = ({
  profileLoading,
  troopLoading,
  membersLoading,
  staffMembers,
  patrolGroups,
  unassignedMembers,
  search,
  setSearch,
}: TroopMembersSegmentProps) => {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  const [isPatrolModalVisible, setIsPatrolModalVisible] = useState(false);
  const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);

  return (
    <>
      <View style={styles.actionsRow}>
        <Pressable
          style={[styles.actionButton, styles.actionPrimary]}
          onPress={() => setIsAddMemberModalVisible(true)}
        >
          <Text style={[styles.actionButtonText, styles.addScoutButtonText]}>
            {t("dashboard.team.addPerson")}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.actionSecondary]}
          onPress={() => setIsPatrolModalVisible(true)}
        >
          <Text style={styles.actionButtonText}>
            {t("dashboard.team.addPatrol")}
          </Text>
        </Pressable>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t("dashboard.team.searchPlaceholder")}
          placeholderTextColor={styles.placeholder.color}
          style={styles.searchInput}
        />
      </View>

      {profileLoading || troopLoading || membersLoading ? (
        <Text style={styles.loadingText}>
          {t("dashboard.team.loadingMembers")}
        </Text>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("dashboard.team.staff")}</Text>
        {staffMembers.length > 0 ? (
          staffMembers.map((member) => (
            <MemberItem member={member} key={member.id} />
          ))
        ) : (
          <Text style={styles.emptyText}>{t("dashboard.team.noStaff")}</Text>
        )}
      </View>

      <PatrolSection patrolGroups={patrolGroups} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t("dashboard.team.unassigned")}
        </Text>
        {unassignedMembers.length > 0 ? (
          unassignedMembers.map((member) => (
            <MemberItem member={member} key={member.id} />
          ))
        ) : (
          <Text style={styles.emptyText}>
            {t("dashboard.team.allAssigned")}
          </Text>
        )}
      </View>
      <AddPatrolModal
        isPatrolModalVisible={isPatrolModalVisible}
        closePatrolModal={() => setIsPatrolModalVisible(false)}
      />

      <AddMemberModal
        isOpen={isAddMemberModalVisible}
        onClose={() => setIsAddMemberModalVisible(false)}
      />
    </>
  );
};

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
}));
