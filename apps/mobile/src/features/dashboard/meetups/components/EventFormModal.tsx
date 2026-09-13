import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Switch, Text, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { EventItem } from "@harcapp/types";
import {
  eventFormDefaultValues,
  EventFormValues,
  eventFormSchema,
} from "@harcapp/validators";

import { DateField, DatePickerField, FormField } from "./FormFields";

interface EventFormModalProps {
  visible: boolean;
  event: EventItem | null;
  initialDate?: string | null;
  onClose: () => void;
  onSubmit: (values: EventFormValues) => void;
}

function toFormValues(
  event: EventItem | null,
  initialDate: string | null | undefined,
): EventFormValues {
  if (!event && initialDate) {
    const startDate = new Date(`${initialDate}T09:00:00`);
    const endDate = new Date(startDate.getTime() + 90 * 60 * 1000);

    return {
      ...eventFormDefaultValues,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }

  return event
    ? {
        title: event.title,
        description: event.description ?? "",
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location ?? "",
        saveToDeviceCalendar: true,
      }
    : eventFormDefaultValues;
}

export function EventFormModal({
  visible,
  event,
  initialDate,
  onClose,
  onSubmit,
}: EventFormModalProps) {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(stylesheet);
  const [picker, setPicker] = useState<"startDate" | "endDate" | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: eventFormDefaultValues,
  });

  useEffect(() => {
    if (visible) reset(toFormValues(event, initialDate));
  }, [event, initialDate, reset, visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.titleRow}>
              <Text style={styles.title}>
                {event
                  ? t("dashboard.meetups.editTitle")
                  : t("dashboard.meetups.addTitle")}
              </Text>
              <Pressable onPress={onClose}>
                <Text style={styles.close}>{t("common.close")}</Text>
              </Pressable>
            </View>
            <FormField
              control={control}
              name="title"
              label={t("dashboard.meetups.form.title")}
              placeholder={t("dashboard.meetups.form.titlePlaceholder")}
              error={
                errors.title?.message ? t(errors.title.message) : undefined
              }
            />
            <FormField
              control={control}
              name="description"
              label={t("dashboard.meetups.form.description")}
              placeholder={t("dashboard.meetups.form.descriptionPlaceholder")}
              multiline
            />
            <FormField
              control={control}
              name="location"
              label={t("dashboard.meetups.form.location")}
              placeholder={t("dashboard.meetups.form.locationPlaceholder")}
            />
            <DateField
              control={control}
              name="startDate"
              label={t("dashboard.meetups.form.startDate")}
              onPress={() => setPicker("startDate")}
            />
            <DateField
              control={control}
              name="endDate"
              label={t("dashboard.meetups.form.endDate")}
              onPress={() => setPicker("endDate")}
              error={
                errors.endDate?.message ? t(errors.endDate.message) : undefined
              }
            />
            {picker ? (
              <DatePickerField
                control={control}
                name={picker}
                onClose={() => setPicker(null)}
              />
            ) : null}
            <Controller
              control={control}
              name="saveToDeviceCalendar"
              render={({ field }) => (
                <View style={styles.switchRow}>
                  <View style={styles.switchCopy}>
                    <Text style={styles.label}>
                      {t("dashboard.meetups.form.deviceCalendar")}
                    </Text>
                    <Text style={styles.hint}>
                      {t("dashboard.meetups.form.deviceCalendarHint")}
                    </Text>
                  </View>
                  <Switch
                    value={field.value}
                    onValueChange={field.onChange}
                    trackColor={{
                      false: theme.colors.muted,
                      true: theme.colors.primary,
                    }}
                    thumbColor={theme.colors.primaryForeground}
                  />
                </View>
              )}
            />
            <View style={styles.buttons}>
              <Pressable style={styles.cancel} onPress={onClose}>
                <Text style={styles.cancelText}>{t("common.cancel")}</Text>
              </Pressable>
              <Pressable
                style={styles.save}
                disabled={isSubmitting}
                onPress={handleSubmit(onSubmit)}
              >
                <Text style={styles.saveText}>{t("common.save")}</Text>
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
    maxHeight: "92%",
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  content: { padding: 22, gap: 4 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { color: theme.colors.foreground, fontSize: 22, fontWeight: "800" },
  close: { color: theme.colors.primary, fontWeight: "700" },
  label: { color: theme.colors.foreground, fontWeight: "700", marginBottom: 7 },
  hint: { color: theme.colors.mutedForeground, fontSize: 12, marginTop: 3 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    gap: 12,
  },
  switchCopy: { flex: 1 },
  buttons: { flexDirection: "row", gap: 10, marginTop: 24 },
  cancel: {
    flex: 1,
    alignItems: "center",
    padding: 13,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelText: { color: theme.colors.foreground, fontWeight: "700" },
  save: {
    flex: 1,
    alignItems: "center",
    padding: 13,
    borderRadius: 11,
    backgroundColor: theme.colors.primary,
  },
  saveText: { color: theme.colors.primaryForeground, fontWeight: "700" },
}));
