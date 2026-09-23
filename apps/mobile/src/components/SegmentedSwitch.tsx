import { Pressable, Text, View } from "react-native";

import { createStyleSheet, useStyles } from "react-native-unistyles";

export interface SegmentedSwitchOption<TKey extends string> {
  key: TKey;
  label: string;
}

interface SegmentedSwitchProps<TKey extends string> {
  activeKey: TKey;
  options: readonly SegmentedSwitchOption<TKey>[];
  onChange: (key: TKey) => void;
}

export function SegmentedSwitch<TKey extends string>({
  activeKey,
  options,
  onChange,
}: SegmentedSwitchProps<TKey>) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = activeKey === option.key;

        return (
          <Pressable
            key={option.key}
            style={[styles.button, selected && styles.buttonActive]}
            onPress={() => onChange(option.key)}
          >
            <Text style={[styles.text, selected && styles.textActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonActive: {
    backgroundColor: theme.colors.primary,
  },
  text: {
    color: theme.colors.mutedForeground,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  textActive: {
    color: theme.colors.primaryForeground,
  },
}));
