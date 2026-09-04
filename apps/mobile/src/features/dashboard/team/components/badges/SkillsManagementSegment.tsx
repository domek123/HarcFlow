import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { useManageMemberBadges } from "../../hooks/useManageMemberBadges";
import { AssignBadgeModal } from "./AssignBadgeModal";
import { MemberBadgesCard } from "./MemberBadgesCard";

export function SkillsManagementSegment() {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  const {
    members,
    isLoading,
    assigningMember,
    openAssign,
    assign,
    changeStatus,
    assignBadge,
    setAssigningMember,
  } = useManageMemberBadges();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("dashboard.team.badges.title")}</Text>
      {isLoading ? (
        <ActivityIndicator color={styles.title.color} />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(member) => member.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MemberBadgesCard
              member={item}
              onAdd={openAssign}
              onStatusChange={changeStatus}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>{t("dashboard.team.badges.empty")}</Text>
          }
        />
      )}
      {assigningMember && (
        <AssignBadgeModal
          visible
          memberName={`${assigningMember.firstName} ${assigningMember.lastName}`}
          ownedBadgeIds={assigningMember.badges.map((badge) => badge.badgeId)}
          isPending={assignBadge.isPending}
          onClose={() => setAssigningMember(undefined)}
          onSubmit={assign}
        />
      )}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: { flex: 1, gap: 12 },
  title: { color: theme.colors.foreground, fontSize: 20, fontWeight: "800" },
  list: { gap: 10, paddingBottom: 8, flexGrow: 1 },
  empty: { color: theme.colors.mutedForeground, paddingVertical: 20 },
}));
