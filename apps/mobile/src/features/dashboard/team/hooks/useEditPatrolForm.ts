import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { PatrolDTO } from "@harcapp/types";
import {
  UpdatePatrolFormValues,
  updatePatrolSchema,
} from "@harcapp/validators";

import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";

const parseTimeToDate = (value?: string) => {
  const [hours = 18, minutes = 0] = (value ?? "18:00")
    .split(":")
    .map((part) => Number(part) || 0);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const formatTimeValue = (value: Date) =>
  value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

export const useEditPatrolForm = (patrol: PatrolDTO | null) => {
  const defaultValues = useMemo<UpdatePatrolFormValues>(
    () => ({
      name: patrol?.name ?? "",
      assemblyDay: patrol?.assemblyDay ?? 1,
      assemblyTime: patrol?.assemblyTime ?? "",
    }),
    [patrol],
  );

  const form = useForm<UpdatePatrolFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(updatePatrolSchema),
    defaultValues,
  });

  const [selectedTime, setSelectedTime] = useState<Date>(() =>
    parseTimeToDate(defaultValues.assemblyTime),
  );
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  useEffect(() => {
    if (patrol) {
      form.reset(defaultValues);
      setSelectedTime(parseTimeToDate(patrol.assemblyTime));
    }
  }, [form, defaultValues, patrol]);

  const onTimeChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }

    if (!selectedDate) return;

    const nextTime = new Date(selectedDate);
    const formattedTime = formatTimeValue(nextTime);

    setSelectedTime(nextTime);
    form.setValue("assemblyTime", formattedTime, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return {
    form,
    defaultValues,
    selectedTime,
    showTimePicker,
    setShowTimePicker,
    onTimeChange,
    formattedTime: formatTimeValue(selectedTime),
  };
};
