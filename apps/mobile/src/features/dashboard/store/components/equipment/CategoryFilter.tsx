import { ScrollView, Pressable, Text } from "react-native";

import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { createEnumOptions } from "@/utils/createEnumOptions";
import { InventoryItemType } from "@harcapp/types";

type Category = InventoryItemType | "ALL";
export function CategoryFilter({
  selected,
  onSelect,
}: {
  selected: Category;
  onSelect: (category: Category) => void;
}) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);

  const enumOptions = createEnumOptions(
    InventoryItemType,
    "dashboard.inventory.categories",
  );
  const options = [
    {
      value: "ALL" as const,
      labelKey: "dashboard.inventory.categories.ALL" as const,
    },
    ...enumOptions,
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => onSelect(option.value)}
          style={[styles.chip, selected === option.value && styles.activeChip]}
        >
          <Text
            style={[
              styles.text,
              selected === option.value && styles.activeText,
            ]}
          >
            {t(`${option.labelKey}`)}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
const stylesheet = createStyleSheet((theme) => ({
  content: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  activeChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  text: {
    color: theme.colors.mutedForeground,
    fontSize: 13,
    fontWeight: "600",
  },
  activeText: { color: theme.colors.primaryForeground },
}));
