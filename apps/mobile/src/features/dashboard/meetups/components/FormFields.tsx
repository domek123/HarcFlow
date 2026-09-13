import { useState, useEffect } from "react";
import { View, TextInput, Pressable, Platform, Text } from "react-native";

import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useForm, Controller } from "react-hook-form";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { EventFormValues } from "@harcapp/validators";

interface FormFieldProps {
  control: ReturnType<typeof useForm<EventFormValues>>["control"];
  name: "title" | "description" | "location";
  label: string;
  placeholder: string;
  error?: string;
  multiline?: boolean;
}

export function FormField({
  control,
  name,
  label,
  placeholder,
  error,
  multiline,
}: FormFieldProps) {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder={placeholder}
            placeholderTextColor={styles.placeholder.color}
            style={[styles.input, multiline && styles.multiline]}
            multiline={multiline}
          />
        )}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

interface DateFieldProps {
  control: ReturnType<typeof useForm<EventFormValues>>["control"];
  name: "startDate" | "endDate";
  label: string;
  onPress: () => void;
  error?: string;
}

export function DateField({
  control,
  name,
  label,
  onPress,
  error,
}: DateFieldProps) {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Pressable style={styles.input} onPress={onPress}>
            <Text style={styles.inputText}>
              {new Intl.DateTimeFormat("pl-PL", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(field.value))}
            </Text>
          </Pressable>
        )}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

interface DatePickerFieldProps {
  control: ReturnType<typeof useForm<EventFormValues>>["control"];
  name: "startDate" | "endDate";
  onClose: () => void;
}

export function DatePickerField({
  control,
  name,
  onClose,
}: DatePickerFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) =>
        Platform.OS === "android" ? (
          <AndroidDatePicker
            value={field.value}
            onChange={field.onChange}
            onClose={onClose}
          />
        ) : (
          <DateTimePicker
            value={new Date(field.value)}
            mode="datetime"
            is24Hour
            display="spinner"
            onChange={(event, date) => {
              if (date) field.onChange(date.toISOString());
              if (event.type === "set") onClose();
            }}
          />
        )
      }
    />
  );
}

interface AndroidDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

function AndroidDatePicker({
  value,
  onChange,
  onClose,
}: AndroidDatePickerProps) {
  const [step, setStep] = useState<"date" | "time">("date");

  useEffect(() => {
    let isMounted = true;
    void DateTimePickerAndroid.open({
      value: new Date(value),
      mode: step,
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (!isMounted) return;
        if (event.type === "dismissed" || !selectedDate) {
          onClose();
          return;
        }

        const nextDate = new Date(value);
        if (step === "date") {
          nextDate.setFullYear(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
          );
          onChange(nextDate.toISOString());
          setStep("time");
          return;
        }

        nextDate.setHours(
          selectedDate.getHours(),
          selectedDate.getMinutes(),
          0,
          0,
        );
        onChange(nextDate.toISOString());
        onClose();
      },
    });

    return () => {
      isMounted = false;
    };
  }, [onChange, onClose, step, value]);

  return null;
}

const stylesheet = createStyleSheet((theme) => ({
  field: { marginTop: 12 },
  label: { color: theme.colors.foreground, fontWeight: "700", marginBottom: 7 },
  input: {
    color: theme.colors.foreground,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 11,
    padding: 12,
  },
  inputText: { color: theme.colors.foreground },
  placeholder: { color: theme.colors.mutedForeground },
  multiline: { minHeight: 78, textAlignVertical: "top" },
  error: { color: theme.colors.destructive, fontSize: 12, marginTop: 4 },
}));
