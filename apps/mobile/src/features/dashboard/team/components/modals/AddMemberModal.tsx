import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Field, SelectField } from "@/components";
import { useCurrentTroopId } from "@/hooks";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/utils/toast";
import {
  useAddMember,
  useFetchPatrols,
  useUpdateTroopMember,
} from "@harcapp/api-client";
import {
  Degree,
  Function,
  Gender,
  Rank,
  ScoutProfileDTO,
} from "@harcapp/types";
import {
  addMemberDefaultValues,
  AddMemberFormValues,
  createAddMemberSchema,
} from "@harcapp/validators";

import {
  genderOptions,
  functionOptions,
  rankOptions,
  degreeOptions,
} from "../../constants";

type AddMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: ScoutProfileDTO | null;
};

export function AddMemberModal({
  isOpen,
  onClose,
  memberToEdit,
}: AddMemberModalProps) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  const { troopId } = useCurrentTroopId();
  const { mutate: addMember, isPending: isAddPending } = useAddMember(troopId);
  const { mutate: updateMember, isPending: isUpdatePending } =
    useUpdateTroopMember(troopId ?? "");
  const { data: patrols } = useFetchPatrols(supabase, troopId);

  const schema = createAddMemberSchema(t);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    watch,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm<AddMemberFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: addMemberDefaultValues,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (memberToEdit) {
      reset({
        firstName: memberToEdit.firstName ?? "",
        lastName: memberToEdit.lastName ?? "",
        email: memberToEdit.email ?? "",
        phoneNumber: memberToEdit.phoneNumber ?? "",
        birthDate: memberToEdit.birthDate
          ? new Date(memberToEdit.birthDate).toISOString().split("T")[0]
          : undefined,
        gender: memberToEdit.gender ?? Gender.MALE,
        function: memberToEdit.function ?? Function.NONE,
        rank: memberToEdit.rank ?? Rank.NONE,
        degree: memberToEdit.degree ?? Degree.NONE,
        patrolId: memberToEdit.patrolId ?? undefined,
      });
      return;
    }

    reset(addMemberDefaultValues);
  }, [isOpen, memberToEdit, reset]);

  const patrolOptions = useMemo(() => {
    if (!patrols) return [];

    return patrols.map((patrol) => {
      return { value: patrol.id, labelKey: patrol.name };
    });
  }, [patrols]);

  const onSubmit = handleSubmit((values) => {
    if (memberToEdit) {
      updateMember(
        {
          ...memberToEdit,
          ...values,
          id: memberToEdit.id,
        },
        {
          onSuccess: () => {
            showToast.success(t("dashboard.team.addMemberModal.editSuccess"));
            reset();
            handleClose();
          },
          onError: (error) => {
            showToast.error(t("dashboard.team.addMemberModal.editError"));
            console.error("Błąd edycji członka:", error);
          },
        },
      );
    } else {
      addMember(
        {
          ...values,
          troopId: troopId!,
        },
        {
          onSuccess: () => {
            showToast.success(t("dashboard.team.addMemberModal.addSuccess"));
            reset();
            onClose();
          },
          onError: (error) => {
            showToast.error(t("dashboard.team.addMemberModal.addError"));
            console.error("Błąd dodawania członka:", error);
          },
        },
      );
    }
  });

  const handleClose = () => {
    setShowDatePicker(false);
    onClose();
  };

  const selectedGender = watch("gender");
  const selectedFunction = watch("function");
  const selectedRank = watch("rank");
  const selectedDegree = watch("degree");
  const selectedPatrol = watch("patrolId");

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>
              {memberToEdit
                ? t("dashboard.team.addMemberModal.editTitle")
                : t("dashboard.team.addMemberModal.addTitle")}
            </Text>

            <Field
              label={t("dashboard.team.addMemberModal.firstName")}
              error={errors.firstName?.message}
            >
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <TextInput
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    style={styles.input}
                    placeholder={t(
                      "dashboard.team.addMemberModal.firstNamePlaceholder",
                    )}
                    placeholderTextColor={styles.placeholder.color}
                  />
                )}
              />
            </Field>

            <Field
              label={t("dashboard.team.addMemberModal.lastName")}
              error={errors.lastName?.message}
            >
              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <TextInput
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    style={styles.input}
                    placeholder={t(
                      "dashboard.team.addMemberModal.lastNamePlaceholder",
                    )}
                    placeholderTextColor={styles.placeholder.color}
                  />
                )}
              />
            </Field>

            <Field
              label={t("dashboard.team.addMemberModal.email")}
              error={errors.email?.message}
            >
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <TextInput
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    style={styles.input}
                    placeholder={t(
                      "dashboard.team.addMemberModal.emailPlaceholder",
                    )}
                    placeholderTextColor={styles.placeholder.color}
                    keyboardType="email-address"
                  />
                )}
              />
            </Field>

            <Field
              label={t("dashboard.team.addMemberModal.phone")}
              error={errors.phoneNumber?.message}
            >
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field }) => (
                  <TextInput
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    style={styles.input}
                    placeholder={t(
                      "dashboard.team.addMemberModal.phonePlaceholder",
                    )}
                    placeholderTextColor={styles.placeholder.color}
                    keyboardType="phone-pad"
                  />
                )}
              />
            </Field>

            <Field
              label={t("dashboard.team.addMemberModal.birthDate")}
              error={errors.birthDate?.message}
            >
              <Controller
                control={control}
                name="birthDate"
                render={({ field }) => {
                  const date = field.value
                    ? new Date(`${field.value}T00:00:00`)
                    : new Date();

                  return (
                    <>
                      <Pressable
                        style={styles.input}
                        onPress={() => setShowDatePicker(true)}
                      >
                        <Text
                          style={
                            field.value ? styles.inputText : styles.placeholder
                          }
                        >
                          {field.value
                            ? date.toLocaleDateString("pl-PL")
                            : t(
                                "dashboard.team.addMemberModal.birthDatePlaceholder",
                              )}
                        </Text>
                      </Pressable>

                      {showDatePicker && (
                        <DateTimePicker
                          value={date}
                          mode="date"
                          display="default"
                          maximumDate={new Date()}
                          onChange={(event, selectedDate) => {
                            setShowDatePicker(false);

                            if (event.type === "dismissed" || !selectedDate) {
                              return;
                            }

                            const year = selectedDate.getFullYear();
                            const month = String(
                              selectedDate.getMonth() + 1,
                            ).padStart(2, "0");
                            const day = String(selectedDate.getDate()).padStart(
                              2,
                              "0",
                            );

                            field.onChange(`${year}-${month}-${day}`);
                          }}
                        />
                      )}
                    </>
                  );
                }}
              />
            </Field>

            <SelectField
              label={t("dashboard.team.addMemberModal.gender")}
              value={selectedGender}
              options={genderOptions}
              onChange={(value) =>
                setValue("gender", value as Gender, {
                  shouldValidate: true,
                })
              }
              error={errors.gender?.message}
            />

            <SelectField
              label={t("dashboard.team.addMemberModal.function")}
              value={selectedFunction}
              options={functionOptions}
              onChange={(value) =>
                setValue("function", value as Function, {
                  shouldValidate: true,
                })
              }
              error={errors.function?.message}
            />

            <SelectField
              label={t("dashboard.team.addMemberModal.rank")}
              value={selectedRank}
              options={rankOptions}
              onChange={(value) =>
                setValue("rank", value as Rank, { shouldValidate: true })
              }
              error={errors.rank?.message}
            />

            <SelectField
              label={t("dashboard.team.addMemberModal.degree")}
              value={selectedDegree}
              options={degreeOptions}
              onChange={(value) =>
                setValue("degree", value as Degree, {
                  shouldValidate: true,
                })
              }
              error={errors.degree?.message}
            />

            {selectedFunction !== Function.DRUZYNOWY &&
              selectedFunction !== Function.PRZYBOCZNY && (
                <SelectField
                  label={t("dashboard.team.addMemberModal.patrol")}
                  value={selectedPatrol}
                  options={patrolOptions}
                  onChange={(value) =>
                    setValue("patrolId", value, {
                      shouldValidate: true,
                    })
                  }
                  error={errors.patrolId?.message}
                />
              )}

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={handleClose}
              >
                <Text style={styles.modalButtonText}>{t("common.cancel")}</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={onSubmit}
                disabled={isAddPending || isUpdatePending}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalConfirmButtonText,
                  ]}
                >
                  {memberToEdit ? t("common.save") : t("common.add")}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxHeight: "85%",
    backgroundColor: theme.colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
  },
  modalTitle: {
    color: theme.colors.foreground,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
  },
  label: {
    color: theme.colors.foreground,
    fontSize: 12,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.foreground,
    fontSize: 14,
    flex: 1,
  },
  inputText: {
    color: theme.colors.foreground,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
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
