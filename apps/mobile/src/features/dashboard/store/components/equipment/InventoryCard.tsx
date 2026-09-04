import React from "react";
import { Pressable, Text, View } from "react-native";

import { Minus, Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { InventoryItem } from "@harcapp/types";

export const InventoryCard = React.memo(function InventoryCard({
  item,
  onIncrement,
  onDecrement,
  onEdit,
  onDelete,
}: {
  item: InventoryItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.badge}>
          {t(`dashboard.inventory.categories.${item.type}`)}
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityLabel={t("dashboard.inventory.decrease")}
          onPress={onDecrement}
          disabled={item.amount === 0}
          style={styles.iconButton}
        >
          <Minus
            size={16}
            color={
              item.amount === 0
                ? theme.colors.mutedForeground
                : theme.colors.foreground
            }
          />
        </Pressable>
        <Text style={styles.amount}>{item.amount}</Text>
        <Pressable
          accessibilityLabel={t("dashboard.inventory.increase")}
          onPress={onIncrement}
          style={styles.iconButton}
        >
          <Plus size={16} color={theme.colors.foreground} />
        </Pressable>
      </View>
      <View style={styles.menu}>
        <Pressable onPress={onEdit}>
          <Text style={styles.menuText}>{t("common.edit")}</Text>
        </Pressable>
        <Pressable onPress={onDelete}>
          <Text style={styles.deleteText}>{t("common.delete")}</Text>
        </Pressable>
      </View>
    </View>
  );
});

const stylesheet = createStyleSheet((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  info: {
    gap: 6,
  },
  name: {
    color: theme.colors.foreground,
    fontSize: 16,
    fontWeight: "700",
  },
  badge: {
    alignSelf: "flex-start",
    color: theme.colors.primary,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: "700",
  },
  actions: {
    position: "absolute",
    right: 12,
    top: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  amount: {
    minWidth: 25,
    color: theme.colors.foreground,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
  },
  menuButton: { marginLeft: 4, padding: 4 },
  menu: {
    flexDirection: "row",
    gap: 18,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 10,
  },
  menuText: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  deleteText: {
    color: theme.colors.destructive,
    fontWeight: "700",
  },
}));
