import { Modal, Pressable, Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type DeleteUserModalProps = {
  isOpen: boolean;
  text: string;
  onClose: () => void;
  onDelete: () => void;
};

export function DeleteUserModal({
  isOpen,
  text,
  onClose,
  onDelete,
}: DeleteUserModalProps) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {t("dashboard.memberDetails.deleteMemberTitle")}
          </Text>
          <Text style={styles.description}>{text}</Text>
          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>{t("common.cancel")}</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteText}>
                {t("dashboard.memberDetails.delete")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    gap: 12,
  },
  title: { color: theme.colors.foreground, fontSize: 22, fontWeight: "800" },
  description: {
    color: theme.colors.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: theme.colors.destructive,
    backgroundColor: theme.colors.destructive,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  cancelText: {
    color: theme.colors.foreground,
    fontSize: 14,
    fontWeight: "700",
  },
  deleteText: {
    color: theme.colors.destructiveForeground,
    fontSize: 14,
    fontWeight: "700",
  },
}));
