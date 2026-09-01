import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { PATROL_DAY_OPTIONS } from "../../constants";
import { useEditPatrol } from "../../hooks/useEditPatrol";
import { useEditPatrolForm } from "../../hooks/useEditPatrolForm";

import type { PatrolGroup } from "../../hooks/useTeamScreen";

type EditPatrolModalProps = {
  isEditPatrolModalOpen: boolean;
  closeModal: () => void;
  patrol: Omit<PatrolGroup, "members"> | null;
};

export const EditPatrolModal = ({
  isEditPatrolModalOpen,
  closeModal,
  patrol,
}: EditPatrolModalProps) => {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);
  const { isUpdatingPatrol, submitPatrolUpdate } = useEditPatrol();

  const {
    form,
    defaultValues,
    selectedTime,
    showTimePicker,
    setShowTimePicker,
    onTimeChange,
    formattedTime,
  } = useEditPatrolForm(patrol);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!patrol) return;

    const wasUpdated = await submitPatrolUpdate(patrol, values);
    if (wasUpdated) {
      closeModal();
      form.reset(defaultValues);
    }
  });

  return (
    <Modal
      transparent
      visible={isEditPatrolModalOpen}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            {t("dashboard.team.editPatrolTitle")}
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              {t("dashboard.team.patrolNameLabel")}
            </Text>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <>
                  <TextInput
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t("dashboard.team.patrolExample")}
                    placeholderTextColor={styles.placeholder.color}
                    style={[
                      styles.input,
                      fieldState.error && styles.inputError,
                    ]}
                  />
                  {fieldState.error ? (
                    <Text style={styles.errorText}>
                      {t(`${fieldState.error.message}`)}
                    </Text>
                  ) : null}
                </>
              )}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              {t("dashboard.team.editPatrolDayLabel")}
            </Text>
            <Controller
              control={form.control}
              name="assemblyDay"
              render={({ field, fieldState }) => (
                <View style={styles.pickerShell}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.pickerScroll}
                  >
                    {PATROL_DAY_OPTIONS.map((day) => (
                      <Pressable
                        key={day}
                        onPress={() => field.onChange(day)}
                        style={[
                          styles.optionButton,
                          field.value === day && styles.optionButtonActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            field.value === day &&
                              styles.optionButtonTextActive,
                          ]}
                        >
                          {t(`dashboard.team.weekdays.${day}`)}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  {fieldState.error ? (
                    <Text style={styles.errorText}>
                      {t(`${fieldState.error.message}`)}
                    </Text>
                  ) : null}
                </View>
              )}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              {t("dashboard.team.editPatrolTimeLabel")}
            </Text>
            <Controller
              control={form.control}
              name="assemblyTime"
              render={({ field, fieldState }) => (
                <View style={styles.pickerShell}>
                  <Pressable
                    style={styles.timeButton}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={styles.timeButtonLabel}>{formattedTime}</Text>
                    <Text style={styles.timeButtonHint}>
                      {t("dashboard.team.select")}
                    </Text>
                  </Pressable>

                  {showTimePicker && (
                    <DateTimePicker
                      value={selectedTime}
                      mode="time"
                      is24Hour={true}
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(_, nextDate) => {
                        if (Platform.OS === "ios") {
                          if (nextDate) {
                            onTimeChange(undefined as never, nextDate);
                          }
                        } else {
                          onTimeChange(undefined as never, nextDate);
                        }
                      }}
                    />
                  )}

                  {fieldState.error ? (
                    <Text style={styles.errorText}>
                      {t(`${fieldState.error.message}`)}
                    </Text>
                  ) : null}
                </View>
              )}
            />
          </View>

          <View style={styles.modalActions}>
            <Pressable
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => {
                form.reset(defaultValues);
                closeModal();
              }}
            >
              <Text style={styles.modalButtonText}>
                {t("dashboard.team.cancel")}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.modalButton, styles.modalConfirmButton]}
              onPress={onSubmit}
              disabled={isUpdatingPatrol}
            >
              <Text
                style={[styles.modalButtonText, styles.modalConfirmButtonText]}
              >
                {!isUpdatingPatrol
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
    gap: 14,
  },
  modalTitle: {
    color: theme.colors.foreground,
    fontSize: 22,
    fontWeight: "800",
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: theme.colors.foreground,
    fontSize: 12,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.foreground,
    backgroundColor: theme.colors.background,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 11,
    marginTop: 2,
  },
  pickerShell: {
    gap: 8,
  },
  pickerScroll: {
    paddingVertical: 2,
  },
  optionButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    marginRight: 8,
  },
  optionButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  optionButtonText: {
    color: theme.colors.foreground,
    fontSize: 12,
    fontWeight: "700",
  },
  optionButtonTextActive: {
    color: theme.colors.secondary,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  timeButtonLabel: {
    color: theme.colors.foreground,
    fontSize: 16,
    fontWeight: "700",
  },
  timeButtonHint: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
    fontWeight: "600",
  },
  placeholder: {
    color: theme.colors.mutedForeground,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 6,
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
