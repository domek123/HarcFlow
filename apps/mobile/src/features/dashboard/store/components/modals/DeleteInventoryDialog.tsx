import { Modal, Pressable, Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { InventoryItem } from "@harcapp/types";

type DeleteInventoryDialogProps = {
  item: InventoryItem | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteInventoryDialog({
  item,
  isPending,
  onCancel,
  onConfirm,
}: DeleteInventoryDialogProps) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  return (
    <Modal
      transparent
      visible={Boolean(item)}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>
            {t("dashboard.inventory.deleteTitle")}
          </Text>
          <Text style={styles.message}>
            {item
              ? t("dashboard.inventory.deleteMessage", { name: item.name })
              : null}
          </Text>
          <View style={styles.actions}>
            <Pressable
              style={styles.cancelButton}
              onPress={onCancel}
              disabled={isPending}
            >
              <Text style={styles.cancelText}>{t("common.cancel")}</Text>
            </Pressable>
            <Pressable
              style={styles.deleteButton}
              onPress={onConfirm}
              disabled={isPending}
            >
              <Text style={styles.deleteText}>{t("common.delete")}</Text>
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
    paddingHorizontal: 24,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  dialog: {
    width: "100%",
    maxWidth: 380,
    gap: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 18,
    backgroundColor: theme.colors.card,
  },
  title: {
    color: theme.colors.foreground,
    fontSize: 19,
    fontWeight: "800",
  },
  message: {
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
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 11,
  },
  cancelText: {
    color: theme.colors.foreground,
    fontWeight: "700",
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 11,
    backgroundColor: theme.colors.destructive,
  },
  deleteText: {
    color: theme.colors.primaryForeground,
    fontWeight: "700",
  },
}));
