import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";
import { View, Pressable, Text } from "react-native";
import { MemberItem } from "./MemberItem";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { PatrolGroup } from "../hooks/useTeamScreen";
import { DeletePatrolModal } from "./DeletePatrolModal";
import { useState } from "react";
import { PatrolDTO } from "@harcapp/types";

export const PatrolSection = ({
  patrolGroups,
}: {
  patrolGroups: PatrolGroup[];
}) => {
  const { styles } = useStyles(stylesheet);

  const [patrolToDelete, setPatrolToDelete] = useState<Pick<
    PatrolDTO,
    "id" | "name"
  > | null>(null);

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("dashboard.team.patrols")}</Text>
        {patrolGroups.length > 0 ? (
          patrolGroups.map((group) => (
            <View key={group.id} style={styles.patrolGroup}>
              <View style={styles.patrolHeader}>
                <Text style={styles.patrolTitle}>
                  {group.name} ({group.members.length})
                </Text>

                <View style={styles.patrolActions}>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() => {
                      console.log("Edit patrol", group.id, group.name);
                    }}
                    accessibilityLabel={`Edytuj zastęp ${group.name}`}
                  >
                    <Ionicons
                      name="pencil"
                      size={16}
                      color={styles.iconButtonText.color}
                    />
                  </Pressable>

                  <Pressable
                    style={styles.iconButtonDanger}
                    onPress={() =>
                      setPatrolToDelete({
                        id: group.id,
                        name: group.name,
                      })
                    }
                    accessibilityLabel={`Usuń zastęp ${group.name}`}
                  >
                    <Ionicons
                      name="trash"
                      size={16}
                      color={styles.iconButtonDangerText.color}
                    />
                  </Pressable>
                </View>
              </View>

              {group.members.length > 0 ? (
                group.members.map((member) => (
                  <MemberItem member={member} key={member.id} />
                ))
              ) : (
                <Text style={styles.emptyText}>
                  {t("dashboard.team.noPatrolMembers")}
                </Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>{t("dashboard.team.noPatrols")}</Text>
        )}
      </View>

      <DeletePatrolModal
        isDeletePatrolModalOpen={patrolToDelete !== null}
        closeModal={() => setPatrolToDelete(null)}
        patrol={patrolToDelete}
      />
    </>
  );
};

const stylesheet = createStyleSheet((theme) => ({
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
  patrolGroup: {
    gap: 10,
    marginTop: 4,
  },
  patrolHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  patrolTitle: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    flex: 1,
  },
  patrolActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonDanger: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonText: {
    color: theme.colors.primary,
  },
  iconButtonDangerText: {
    color: "#ef4444",
  },
  emptyText: {
    color: theme.colors.mutedForeground,
    fontSize: 13,
  },
}));
