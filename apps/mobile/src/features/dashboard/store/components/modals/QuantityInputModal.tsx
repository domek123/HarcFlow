import React, { useMemo, useRef, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface QuantityInputModalProps {
  visible: boolean;
  badgeName: string;
  currentQuantity: number;
  onClose: () => void;
  onSubmit: (targetQuantity: number) => void;
}

export function QuantityInputModal({
  visible,
  badgeName,
  currentQuantity,
  onClose,
  onSubmit,
}: QuantityInputModalProps) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState(String(currentQuantity));

  const normalizedValue = useMemo(() => {
    const sanitized = inputValue.replace(/[^\d]/g, "");
    if (!sanitized) return 0;

    const parsed = Number.parseInt(sanitized, 10);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }, [inputValue]);

  const handleSave = () => {
    onSubmit(normalizedValue);
    setInputValue(String(currentQuantity));
  };

  const handleClose = () => {
    setInputValue(String(currentQuantity));
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.modalCard} onPress={() => undefined}>
          <Text style={styles.title}>
            {t("dashboard.inventory.quantityModal.title")}
          </Text>
          <Text style={styles.badgeName}>{badgeName}</Text>

          <TextInput
            ref={inputRef}
            value={inputValue}
            onChangeText={(value) => {
              if (value === "") {
                setInputValue("");
                return;
              }

              const digitsOnly = value.replace(/[^\d]/g, "");
              setInputValue(digitsOnly);
            }}
            keyboardType="numeric"
            selectTextOnFocus
            autoFocus
            style={styles.input}
            placeholder={t("dashboard.inventory.quantityModal.placeholder")}
            placeholderTextColor={styles.placeholder.color}
            maxLength={4}
          />

          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>{t("common.cancel")}</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>{t("common.save")}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  title: {
    color: theme.colors.foreground,
    fontSize: 18,
    fontWeight: "700",
  },
  badgeName: {
    color: theme.colors.mutedForeground,
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.foreground,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  placeholder: {
    color: theme.colors.mutedForeground,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  button: {
    minWidth: 90,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    color: theme.colors.foreground,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  saveButtonText: {
    color: theme.colors.primaryForeground,
    fontWeight: "700",
  },
}));
