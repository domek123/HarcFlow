import { supabase } from "@/lib/supabase";
import { showToast } from "@/utils/toast";
import {
  useDeletePatrol,
  useFetchCurrentScoutProfile,
} from "@harcapp/api-client";
import { PatrolDTO } from "@harcapp/types";
import { useTranslation } from "react-i18next";
import { Modal, View, Pressable, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type DeletePatrolModalProps = {
  isDeletePatrolModalOpen: boolean;
  closeModal: () => void;
  patrol: Pick<PatrolDTO, "id" | "name"> | null;
};

export const DeletePatrolModal = ({
  patrol,
  isDeletePatrolModalOpen,
  closeModal,
}: DeletePatrolModalProps) => {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  const { data: currentUser } = useFetchCurrentScoutProfile(supabase);

  const { mutateAsync: deletePatrol, isPending: isDeletingPatrol } =
    useDeletePatrol(supabase, currentUser?.troopId);

  const handleDeletePatrol = async () => {
    if (patrol) {
      try {
        await deletePatrol(patrol.id);
        showToast.success(t("dashboard.team.deletePatrolSuccess"));
        closeModal();
      } catch {
        showToast.error(t("dashboard.team.deletePatrolError"));
      }
    }
  };

  return (
    <Modal
      transparent
      visible={isDeletePatrolModalOpen}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            {t("dashboard.team.deletePatrolTitle")}
          </Text>
          <Text style={styles.modalDescription}>
            {t("dashboard.team.deletePatrolMessage", {
              patrolName: patrol?.name,
            })}
          </Text>

          <View style={styles.modalActions}>
            <Pressable
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={closeModal}
            >
              <Text style={styles.modalButtonText}>
                {t("dashboard.team.cancel")}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.modalButton, styles.modalConfirmButton]}
              onPress={handleDeletePatrol}
              disabled={isDeletingPatrol}
            >
              <Text
                style={[styles.modalButtonText, styles.modalConfirmButtonText]}
              >
                {!isDeletingPatrol
                  ? t("dashboard.team.deletePatrolConfirm")
                  : t("common.deleting")}
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
    fontSize: 14,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
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
}));
