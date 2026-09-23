import { useEffect } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Field } from "@/components";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/utils/toast";
import {
  useCreateParentAndLinkToUser,
  useUpdateParent,
} from "@harcapp/api-client";
import { ParentDTO } from "@harcapp/types";
import {
  createParentSchema,
  parentDefaultValues,
  type ParentFormData,
} from "@harcapp/validators";

export type { ParentFormData } from "@harcapp/validators";

type AddEditParentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  parent?: ParentDTO | null;
  userId: string;
};

export function AddEditParentModal({
  isOpen,
  onClose,
  parent,
  userId,
}: AddEditParentModalProps) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  const { mutate: addParent } = useCreateParentAndLinkToUser(supabase, userId);
  const { mutate: updateParent } = useUpdateParent(supabase, userId);

  const isEditing = Boolean(parent);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentFormData>({
    resolver: zodResolver(createParentSchema(t)),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: parentDefaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(parent ?? parentDefaultValues);
    }
  }, [isOpen, parent, reset]);

  const handleSave = handleSubmit((values) => {
    const mutationOptions = {
      onSuccess: () => {
        showToast.success(
          isEditing
            ? t("dashboard.memberDetails.editParentSuccess")
            : t("dashboard.memberDetails.addParentSuccess"),
        );
        reset(parentDefaultValues);
        onClose();
      },
      onError: (error: unknown) => {
        showToast.error(
          isEditing
            ? t("dashboard.memberDetails.editParentError")
            : t("dashboard.memberDetails.addParentError"),
        );
        console.error("Błąd zapisu rodzica:", error);
      },
    };

    if (isEditing && parent?.id) {
      updateParent(
        {
          parentId: parent.id,
          input: values,
        },
        mutationOptions,
      );
    } else {
      addParent(values, mutationOptions);
    }
  });

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
            {isEditing
              ? t("dashboard.memberDetails.editParentTitle")
              : t("dashboard.memberDetails.addParentTitle")}
          </Text>

          <ParentInput
            control={control}
            name="firstName"
            label={t("dashboard.memberDetails.firstName")}
            placeholder={t(
              "dashboard.memberDetails.parentFirstNamePlaceholder",
            )}
            error={errors.firstName?.message}
          />
          <ParentInput
            control={control}
            name="lastName"
            label={t("dashboard.memberDetails.lastName")}
            placeholder={t("dashboard.memberDetails.parentLastNamePlaceholder")}
            error={errors.lastName?.message}
          />
          <ParentInput
            control={control}
            name="phoneNumber"
            label={t("dashboard.memberDetails.phone")}
            placeholder={t("dashboard.memberDetails.parentEmailPlaceholder")}
            error={errors.phoneNumber?.message}
            keyboardType="phone-pad"
          />
          <ParentInput
            control={control}
            name="email"
            label={t("dashboard.memberDetails.email")}
            placeholder={t("dashboard.memberDetails.parentPhonePlaceholder")}
            error={errors.email?.message}
            keyboardType="email-address"
          />

          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>{t("common.cancel")}</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>{t("dashboard.team.save")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ParentInput({
  control,
  name,
  label,
  error,
  placeholder,
  keyboardType,
}: {
  control: ReturnType<typeof useForm<ParentFormData>>["control"];
  name: keyof ParentFormData;
  label: string;
  error?: string;
  placeholder: string;
  keyboardType?: "phone-pad" | "email-address";
}) {
  const { styles } = useStyles(stylesheet);
  return (
    <Field label={label} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            keyboardType={keyboardType}
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={styles.placeholder.color}
          />
        )}
      />
    </Field>
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
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: theme.colors.foreground,
    backgroundColor: theme.colors.background,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  saveButton: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  cancelText: {
    color: theme.colors.foreground,
    fontSize: 14,
    fontWeight: "700",
  },
  saveText: {
    color: theme.colors.primaryForeground,
    fontSize: 14,
    fontWeight: "700",
  },
  placeholder: {
    color: theme.colors.mutedForeground,
  },
}));
