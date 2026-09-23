import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import {
  type AppearanceOption,
  useAppearanceStore,
} from "../../../../store/useAppearanceStore";

interface AppearanceScreenProps {
  visible: boolean;
  onClose: () => void;
}

const appearanceOptions: ReadonlyArray<{
  key: AppearanceOption;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { key: "light", icon: "sunny-outline" },
  { key: "dark", icon: "moon-outline" },
  { key: "system", icon: "settings-outline" },
];

export function AppearanceScreen({ visible, onClose }: AppearanceScreenProps) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);
  const selectedOption = useAppearanceStore((state) => state.appearance);
  const setAppearance = useAppearanceStore((state) => state.setAppearance);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <View style={styles.heading}>
                <Text style={styles.title}>
                  {t("dashboard.appearance.title")}
                </Text>
                <Pressable
                  accessibilityLabel={t("common.close")}
                  accessibilityRole="button"
                  onPress={onClose}
                  style={styles.closeButton}
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color={styles.closeIcon.color}
                  />
                </Pressable>
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
                    onPress={() => setAppearance(option.key)}
                    style={[styles.option, selected && styles.selectedOption]}
                  >
                    <View
                      style={[styles.icon, selected && styles.selectedIcon]}
                    >
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
        </View>
      </View>
    </Modal>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  sheet: {
    maxHeight: "80%",
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
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
  heading: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.margins.sm,
  },
  closeButton: {
    padding: theme.margins.xs,
  },
  closeIcon: {
    color: theme.colors.foreground,
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
