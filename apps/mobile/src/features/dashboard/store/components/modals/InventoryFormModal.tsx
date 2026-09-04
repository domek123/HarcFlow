import { useEffect } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { InventoryItem, InventoryItemType } from "@harcapp/types";
import {
  InventoryItemFormValues,
  inventoryItemDefaultValues,
  inventoryItemSchema,
} from "@harcapp/validators";

export function InventoryFormModal({
  visible,
  item,
  isPending,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  item: InventoryItem | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (values: InventoryItemFormValues) => void;
}) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: inventoryItemDefaultValues,
  });

  useEffect(() => {
    if (visible)
      reset(
        item
          ? { name: item.name, type: item.type, amount: item.amount }
          : inventoryItemDefaultValues,
      );
  }, [item, reset, visible]);

  const selectedType = watch("type");
  const selectedAmount = watch("amount");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView>
            <Text style={styles.title}>
              {item
                ? t("dashboard.inventory.editTitle")
                : t("dashboard.inventory.addTitle")}
            </Text>
            <Text style={styles.label}>{t("dashboard.inventory.name")}</Text>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  style={styles.input}
                  placeholder={t("dashboard.inventory.namePlaceholder")}
                  placeholderTextColor={styles.placeholder.color}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.error}>
                {t("dashboard.inventory.nameRequired")}
              </Text>
            )}
            <Text style={styles.label}>
              {t("dashboard.inventory.category")}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}

              contentContainerStyle={styles.chips}
            >
              {Object.values(InventoryItemType).map((type) => (
                <Pressable
                  key={type}
                  onPress={() => setValue("type", type)}
                  style={[
                    styles.chip,
                    selectedType === type && styles.activeChip,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedType === type && styles.activeChipText,
                    ]}
                  >
                    {t(`dashboard.inventory.categories.${type}`)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Text style={styles.label}>{t("dashboard.inventory.amount")}</Text>
            <View style={styles.amountRow}>
              <Pressable
                style={styles.stepButton}
                onPress={() =>
                  setValue("amount", Math.max(0, selectedAmount - 1))
                }
              >
                <Text style={styles.stepText}>-</Text>
              </Pressable>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <TextInput
                    value={String(field.value)}
                    onChangeText={(value) =>
                      field.onChange(
                        Number.parseInt(value.replace(/\D/g, "") || "0", 10),
                      )
                    }
                    keyboardType="number-pad"
                    style={styles.amountInput}
                  />
                )}
              />
              <Pressable
                style={styles.stepButton}
                onPress={() => setValue("amount", selectedAmount + 1)}
              >
                <Text style={styles.stepText}>+</Text>
              </Pressable>
            </View>
            <View style={styles.buttons}>
              <Pressable style={styles.cancel} onPress={onClose}>
                <Text style={styles.cancelText}>{t("common.cancel")}</Text>
              </Pressable>
              <Pressable
                disabled={isPending}
                style={styles.save}
                onPress={handleSubmit(onSubmit)}
              >
                {isPending ? (
                  <ActivityIndicator color={styles.saveText.color} />
                ) : (
                  <Text style={styles.saveText}>{t("common.save")}</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
const stylesheet = createStyleSheet((theme) => ({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    maxHeight: "90%",
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 22,
  },
  title: {
    color: theme.colors.foreground,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
  },
  label: {
    color: theme.colors.foreground,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    color: theme.colors.foreground,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 11,
    padding: 12,
  },
  placeholder: {
    color: theme.colors.mutedForeground,
  },
  error: {
    color: theme.colors.destructive,
    fontSize: 12,
    marginTop: 4,
  },
  chips: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  activeChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.mutedForeground,
    fontWeight: "600",
  },
  activeChipText: {
    color: theme.colors.primaryForeground,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  stepButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    color: theme.colors.foreground,
    fontSize: 22,
  },
  amountInput: {
    color: theme.colors.foreground,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    minWidth: 60,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
  },
  cancel: {
    flex: 1,
    alignItems: "center",
    padding: 13,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelText: {
    color: theme.colors.foreground,
    fontWeight: "700",
  },
  save: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 13,
    borderRadius: 11,
    backgroundColor: theme.colors.primary,
  },
  saveText: {
    color: theme.colors.primaryForeground,
    fontWeight: "700",
  },
}));
