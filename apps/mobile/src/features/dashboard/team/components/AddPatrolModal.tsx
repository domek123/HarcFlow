import { t } from "i18next";
import { Modal, View, TextInput, Pressable, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useAddPatrol } from "../hooks/useAddPatrol";

type AddPatrolModalProps = {
  isPatrolModalVisible: boolean;
  closePatrolModal: () => void;
};

export const AddPatrolModal = ({
  isPatrolModalVisible,
  closePatrolModal,
}: AddPatrolModalProps) => {
  const { styles } = useStyles(stylesheet);

  const { patrolName, setPatrolName, handleAddPatrol, isAddingPatrol } =
    useAddPatrol();

  return (
    <Modal
      transparent
      visible={isPatrolModalVisible}
      animationType="fade"
      onRequestClose={closePatrolModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            {t("dashboard.team.addPatrolTitle")}
          </Text>
          <Text style={styles.modalDescription}>
            {t("dashboard.team.patrolNameLabel")}
          </Text>
          <TextInput
            value={patrolName}
            onChangeText={setPatrolName}
            placeholder={t("dashboard.team.patrolExample")}
            placeholderTextColor={styles.placeholder.color}
            style={styles.modalInput}
          />

          <View style={styles.modalActions}>
            <Pressable
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => {
                setPatrolName("");
                closePatrolModal();
              }}
            >
              <Text style={styles.modalButtonText}>
                {t("dashboard.team.cancel")}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.modalButton, styles.modalConfirmButton]}
              onPress={() => {
                handleAddPatrol(closePatrolModal);
              }}
              disabled={isAddingPatrol}
            >
              <Text
                style={[styles.modalButtonText, styles.modalConfirmButtonText]}
              >
                {!isAddingPatrol
                  ? t("dashboard.team.save")
                  : t("common.saving")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    gap: 12,
  },
  modalTitle: {
    color: theme.colors.foreground,
    fontSize: 22,
    fontWeight: "800",
  },
  modalDescription: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.foreground,
    backgroundColor: theme.colors.background,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  modalCancelButton: {
    backgroundColor: "transparent",
    borderColor: theme.colors.border,
  },
  modalConfirmButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  modalButtonText: {
    color: theme.colors.foreground,
    fontSize: 14,
    fontWeight: "700",
  },
  modalConfirmButtonText: {
    color: theme.colors.secondary,
  },
  placeholder: {
    color: theme.colors.mutedForeground,
  },
}));
