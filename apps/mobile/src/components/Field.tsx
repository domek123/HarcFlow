import { ReactNode } from "react";
import { View, Text } from "react-native";

import { createStyleSheet, useStyles } from "react-native-unistyles";

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export function Field({ label, error, children }: FieldProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      {children}
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
  errorText: {
    color: "#ef4444",
    fontSize: 11,
  },
}));
