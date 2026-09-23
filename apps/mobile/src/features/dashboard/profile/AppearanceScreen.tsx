import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from "react-native-unistyles";

type AppearanceOption = "light" | "dark" | "system";

const appearanceOptions: ReadonlyArray<{
  key: AppearanceOption;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { key: "light", icon: "sunny-outline" },
  { key: "dark", icon: "moon-outline" },
  { key: "system", icon: "settings-outline" },
];

export function AppearanceScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { styles } = useStyles(stylesheet);
  const [selectedOption, setSelectedOption] =
    useState<AppearanceOption>(getInitialAppearance);

  const selectAppearance = (option: AppearanceOption) => {
    setSelectedOption(option);

    if (option === "system") {
      UnistylesRuntime.setAdaptiveThemes(true);
      return;
    }

    UnistylesRuntime.setAdaptiveThemes(false);
    UnistylesRuntime.setTheme(option);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.heading}>
            <Pressable
              accessibilityLabel={t("dashboard.myData.back")}
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>‹</Text>
            </Pressable>
            <Text style={styles.title}>{t("dashboard.appearance.title")}</Text>
          </View>
          <Text style={styles.description}>
            {t("dashboard.appearance.description")}
          </Text>
        </View>

        <View style={styles.options}>
          {appearanceOptions.map((option) => {
            const selected = selectedOption === option.key;

            return (
              <Pressable
                key={option.key}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => selectAppearance(option.key)}
                style={[styles.option, selected && styles.selectedOption]}
              >
                <View style={[styles.icon, selected && styles.selectedIcon]}>
                  <Ionicons
                    name={option.icon}
                    size={22}
                    color={
                      selected
                        ? styles.selectedIconGlyph.color
                        : styles.iconGlyph.color
                    }
                  />
                </View>
                <View style={styles.optionCopy}>
                  <Text style={styles.optionTitle}>
                    {t(`dashboard.appearance.options.${option.key}.title`)}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {t(
                      `dashboard.appearance.options.${option.key}.description`,
                    )}
                  </Text>
                </View>
                <Ionicons
                  name={selected ? "checkmark-circle" : "ellipse-outline"}
                  size={22}
                  color={
                    selected
                      ? styles.selectedIndicator.color
                      : styles.indicator.color
                  }
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getInitialAppearance(): AppearanceOption {
  if (UnistylesRuntime.hasAdaptiveThemes) {
    return "system";
  }

  return UnistylesRuntime.themeName === "dark" ? "dark" : "light";
}

const stylesheet = createStyleSheet((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.margins.lg,
    paddingBottom: theme.margins.xl,
    gap: theme.margins.lg,
  },
  header: {
    alignItems: "flex-start",
    gap: theme.margins.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: theme.colors.foreground,
    fontSize: 34,
    lineHeight: 34,
  },
  backIcon: {
    color: theme.colors.foreground,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    gap: 10,
  },
  title: {
    color: theme.colors.foreground,
    fontSize: 28,
    fontWeight: "800",
  },
  description: {
    color: theme.colors.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
  },
  options: {
    gap: theme.margins.sm,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.margins.md,
    padding: theme.margins.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.secondary,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.muted,
  },
  selectedIcon: {
    backgroundColor: theme.colors.primary,
  },
  iconGlyph: {
    color: theme.colors.foreground,
  },
  selectedIconGlyph: {
    color: theme.colors.primaryForeground,
  },
  optionCopy: {
    flex: 1,
    gap: theme.margins.xs,
  },
  optionTitle: {
    color: theme.colors.foreground,
    fontSize: 16,
    fontWeight: "700",
  },
  optionDescription: {
    color: theme.colors.mutedForeground,
    fontSize: 13,
    lineHeight: 18,
  },
  indicator: {
    color: theme.colors.mutedForeground,
  },
  selectedIndicator: {
    color: theme.colors.primary,
  },
}));
