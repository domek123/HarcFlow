// src/components/BadgeRow.tsx
import React from "react";
import { Pressable, Text, View } from "react-native";

import { createStyleSheet, useStyles } from "react-native-unistyles";

import type { BadgeTroopInventory } from "@harcapp/types";

interface BadgeRowProps {
  badge: BadgeTroopInventory;
  quantity: number;
  onCountChange: (badgeId: string, delta: number) => void;
  onOpenQuantityModal: (badgeId: string, currentQuantity: number) => void;
}

export const BadgeRow = React.memo(
  function BadgeRow({
    badge,
    quantity,
    onCountChange,
    onOpenQuantityModal,
  }: BadgeRowProps) {
    const { styles } = useStyles(stylesheet);

    const renderStars = (level: number | null) => {
      if (level === null) {
        return <Text style={styles.levelEmpty}>—</Text>;
      }

      return Array.from({ length: 3 }, (_, index) => (
        <Text
          key={`star-${index}`}
          style={[
            styles.levelStar,
            index < level ? styles.levelStarActive : styles.levelStarInactive,
          ]}
        >
          ★
        </Text>
      ));
    };

    return (
      <View style={styles.badgeRow}>
        <View style={styles.badgeInfo}>
          <Text style={styles.badgeName}>{badge.name}</Text>
          <View style={styles.levelRow}>{renderStars(badge.level)}</View>
        </View>

        <View style={styles.badgeControls}>
          <Pressable
            accessibilityRole="button"
            onPress={() => onOpenQuantityModal(badge.id, quantity)}
            hitSlop={8}
            style={styles.stockValueButton}
          >
            <Text style={styles.stockValue}>{quantity}</Text>
          </Pressable>

          <View style={styles.counterRow}>
            <Pressable
              accessibilityRole="button"
              style={[
                styles.counterButton,
                quantity <= 0 && styles.counterButtonDisabled,
              ]}
              onPress={() => onCountChange(badge.id, -1)}
              disabled={quantity <= 0}
            >
              <Text style={styles.counterButtonText}>−</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              style={styles.counterButton}
              onPress={() => onCountChange(badge.id, 1)}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) =>
    prevProps.quantity === nextProps.quantity &&
    prevProps.badge === nextProps.badge &&
    prevProps.onOpenQuantityModal === nextProps.onOpenQuantityModal &&
    prevProps.onCountChange === nextProps.onCountChange,
);

const stylesheet = createStyleSheet((theme) => ({
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
    marginBottom: 8,
  },
  badgeInfo: {
    flex: 1,
    gap: 6,
  },
  badgeName: {
    color: theme.colors.foreground,
    fontSize: 14,
    fontWeight: "600",
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  levelStar: {
    fontSize: 12,
    lineHeight: 14,
  },
  levelStarActive: {
    color: theme.colors.primary,
  },
  levelStarInactive: {
    color: theme.colors.mutedForeground,
    opacity: 0.45,
  },
  levelEmpty: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
    fontWeight: "600",
  },
  badgeControls: {
    alignItems: "flex-end",
    gap: 8,
  },
  stockValueButton: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
    opacity: 1,
  },
  stockValue: {
    color: theme.colors.foreground,
    fontSize: 18,
    fontWeight: "800",
    minWidth: 26,
    textAlign: "center",
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  counterButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  counterButtonDisabled: {
    opacity: 0.45,
  },
  counterButtonText: {
    color: theme.colors.primaryForeground,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 18,
  },
}));
