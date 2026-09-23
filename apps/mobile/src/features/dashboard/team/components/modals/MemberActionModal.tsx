import { Modal, View, Pressable, Text, StyleSheet } from "react-native";

import { X, UserRound, UsersRound } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type MemberActionModalProps = {
  isAddMenuVisible: boolean;
  closeModal: () => void;
  openAddMemberModal: () => void;
  openAddPatrolModal: () => void;
};

export function MemberActionModal({
  isAddMenuVisible,
  closeModal,
  openAddMemberModal,
  openAddPatrolModal,
}: MemberActionModalProps) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  return (
    <Modal
      transparent
      visible={isAddMenuVisible}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={styles.addMenuOverlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.cancel")}
          style={styles.addMenuBackdrop}
          onPress={closeModal}
        />
        <View style={styles.addMenu}>
          <View style={styles.addMenuHeader}>
            <View>
              <Text style={styles.addMenuTitle}>
                {t("dashboard.team.addTitle")}
              </Text>
              <Text style={styles.addMenuDescription}>
                {t("dashboard.team.addDescription")}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("common.cancel")}
              style={styles.closeButton}
              onPress={closeModal}
            >
              <X size={20} color={styles.closeIcon.color} />
            </Pressable>
          </View>

          <Pressable style={styles.addOption} onPress={openAddMemberModal}>
            <View style={[styles.addOptionIcon, styles.memberIcon]}>
              <UserRound size={22} color={styles.memberIconGlyph.color} />
            </View>
            <View style={styles.addOptionContent}>
              <Text style={styles.addOptionTitle}>
                {t("dashboard.team.addPerson")}
              </Text>
              <Text style={styles.addOptionDescription}>
                {t("dashboard.team.addPersonDescription")}
              </Text>
            </View>
          </Pressable>

          <Pressable style={styles.addOption} onPress={openAddPatrolModal}>
            <View style={[styles.addOptionIcon, styles.patrolIcon]}>
              <UsersRound size={22} color={styles.patrolIconGlyph.color} />
            </View>
            <View style={styles.addOptionContent}>
              <Text style={styles.addOptionTitle}>
                {t("dashboard.team.addPatrol")}
              </Text>
              <Text style={styles.addOptionDescription}>
                {t("dashboard.team.addPatrolDescription")}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  addMenuOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  addMenuBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.42)",
  },
  addMenu: {
    gap: 10,
    padding: 20,
    paddingBottom: 28,
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addMenuHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  addMenuTitle: {
    color: theme.colors.foreground,
    fontSize: 22,
    fontWeight: "800",
  },
  addMenuDescription: {
    color: theme.colors.mutedForeground,
    fontSize: 13,
    marginTop: 3,
  },
  closeButton: {
    padding: 6,
    marginTop: -4,
    marginRight: -4,
  },
  closeIcon: {
    color: theme.colors.mutedForeground,
  },
  addOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 72,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  addOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  memberIcon: {
    backgroundColor: theme.colors.primary,
  },
  memberIconGlyph: {
    color: theme.colors.primaryForeground,
  },
  patrolIcon: {
    backgroundColor: theme.colors.secondary,
  },
  patrolIconGlyph: {
    color: theme.colors.secondaryForeground,
  },
  addOptionContent: {
    flex: 1,
    gap: 3,
  },
  addOptionTitle: {
    color: theme.colors.foreground,
    fontSize: 15,
    fontWeight: "700",
  },
  addOptionDescription: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
  },
}));
