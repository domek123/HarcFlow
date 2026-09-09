import { View, Pressable, Text, ScrollView } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type SelectFieldProps = {
  label: string;
  value?: string;
  options: readonly { value: string; labelKey: string }[];
  onChange: (value: string) => void;
  error?: string;
};

export function SelectField({
  label,
  value,
  options,
  onChange,
  error,
}: SelectFieldProps) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.selectContainer}
      >
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[
                styles.optionButton,
                isActive && styles.optionButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  isActive && styles.optionButtonTextActive,
                ]}
              >
                {t(option.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  fieldGroup: {
    gap: 6,
    marginBottom: 12,
  },
  label: {
    color: theme.colors.foreground,
    fontSize: 12,
    fontWeight: "700",
  },
  selectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    marginRight: 8,
  },
  optionButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionButtonText: {
    color: theme.colors.foreground,
    fontSize: 11,
    fontWeight: "700",
  },
  optionButtonTextActive: {
    color: theme.colors.secondary,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 11,
  },
}));
