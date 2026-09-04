import { memo, useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { ChevronDown, ChevronRight, Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import {
  BadgeStatus,
  getBadgeById,
  ScoutProfileWithBadgesDTO,
} from "@harcapp/types";

interface MemberBadgesCardProps {
  member: ScoutProfileWithBadgesDTO;
  onAdd: (member: ScoutProfileWithBadgesDTO) => void;
  onStatusChange: (
    profileId: string,
    badgeId: string,
    status: BadgeStatus,
  ) => void;
}
const statusOrder: Record<string, number> = {
  WON: 0,
  COMPLETED: 1,
  PLANNED: 2,
};

export const MemberBadgesCard = memo(function MemberBadgesCard({
  member,
  onAdd,
  onStatusChange,
}: MemberBadgesCardProps) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  const [expanded, setExpanded] = useState(false);

  const sortedBadges = useMemo(
    () =>
      [...member.badges].sort(
        (a, b) => (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99),
      ),
    [member.badges],
  );

  const toggle = useCallback(() => setExpanded((value) => !value), []);

  const handleStatusChange = (badgeId: string, currentStatus: BadgeStatus) => {
    if (currentStatus === BadgeStatus.PLANNED)
      return onStatusChange(member.id, badgeId, BadgeStatus.COMPLETED);

    return onStatusChange(member.id, badgeId, BadgeStatus.WON);
  };

  const renderStars = (level: number | null) => {
    if (level === null) {
      return <Text style={styles.levelEmpty}>—</Text>;
    }

    return Array.from({ length: 3 }, (_, index) => (
      <Text
        key={`star-${index}`}
        style={[
          styles.levelStar,
          index < level ? styles.levelStarActive : styles.levelStarInactive,
        ]}
      >
        ★
      </Text>
    ));
  };

  const memberWonBadges = useMemo(() => {
    return member.badges.filter(
      (badge) => badge.status !== BadgeStatus.PLANNED,
    );
  }, [member.badges]);

  return (
    <View style={styles.card}>
      <Pressable onPress={toggle} style={styles.memberRow}>
        {expanded ? (
          <ChevronDown size={19} color={styles.name.color} />
        ) : (
          <ChevronRight size={19} color={styles.name.color} />
        )}
        <View style={styles.memberText}>
          <Text style={styles.name}>
            {member.firstName} {member.lastName}
          </Text>
          <Text style={styles.count}>
            {memberWonBadges.length} {t("dashboard.team.badges.badges")}
          </Text>
        </View>
        <Pressable
          onPress={() => onAdd(member)}
          style={styles.addButton}
          accessibilityLabel={t("dashboard.team.badges.assign")}
        >
          <Plus size={18} color={styles.addText.color} />
        </Pressable>
      </Pressable>
      {expanded && (
        <View style={styles.details}>
          {sortedBadges.length === 0 ? (
            <Text style={styles.empty}>
              {t("dashboard.team.badges.noBadges")}
            </Text>
          ) : (
            sortedBadges.map((badge, index) => {
              const badgeDefinition = getBadgeById(badge.badgeId);

              return (
                <View
                  key={badge.badgeId}
                  style={[
                    styles.badgeRow,
                    index < sortedBadges.length - 1 && styles.badgeRowSeparated,
                  ]}
                >
                  <View style={styles.badgeSummary}>
                    <View style={styles.badgeTitleRow}>
                      <Text style={styles.badgeName}>
                        {badgeDefinition?.name ?? badge.badgeId}
                      </Text>
                      <View style={styles.levelRow}>
                        {renderStars(badgeDefinition?.level ?? null)}
                      </View>
                    </View>
                    <Text style={styles.statusText}>
                      {t(`enums.badgeStatus.${badge.status}`)}
                    </Text>
                  </View>
                  {badge.status !== BadgeStatus.WON && (
                    <Pressable
                      onPress={() =>
                        handleStatusChange(badge.badgeId, badge.status)
                      }
                      style={styles.changeButton}
                    >
                      <Text style={styles.changeButtonText}>
                        {badge.status == BadgeStatus.PLANNED
                          ? t("dashboard.team.badges.complete")
                          : t("dashboard.team.badges.win")}
                      </Text>
                    </Pressable>
                  )}
                </View>
              );
            })
          )}
        </View>
      )}
    </View>
  );
});

const stylesheet = createStyleSheet((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    overflow: "hidden",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    padding: 14,
  },
  memberText: {
    flex: 1,
    gap: 3,
  },
  name: {
    color: theme.colors.foreground,
    fontSize: 16,
    fontWeight: "800",
  },
  count: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    padding: 8,
  },
  addText: { color: theme.colors.background },
  details: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    padding: 12,
    gap: 10,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badgeRowSeparated: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 10,
  },
  badgeSummary: {
    flex: 1,
    gap: 4,
  },
  badgeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badgeName: {
    color: theme.colors.foreground,
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  levelStar: {
    fontSize: 12,
    lineHeight: 14,
  },
  levelStarActive: {
    color: theme.colors.primary,
  },
  levelStarInactive: {
    color: theme.colors.mutedForeground,
    opacity: 0.45,
  },
  levelEmpty: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
    fontWeight: "600",
  },
  statusText: {
    color: theme.colors.mutedForeground,
    fontSize: 11,
    fontWeight: "700",
  },
  changeButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  changeButtonText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  empty: {
    color: theme.colors.mutedForeground,
    fontSize: 13,
  },
}));
