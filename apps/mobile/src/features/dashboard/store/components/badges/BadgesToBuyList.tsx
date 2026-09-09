import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { ChevronDown, ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { supabase } from "@/lib/supabase";
import { useBadgesToBuy } from "@harcapp/api-client";
import { BadgeToBuyDTO, getBadgeById } from "@harcapp/types";

type BadgesToBuyListProps = {
  troopId?: string;
};

export function BadgesToBuyList({ troopId }: BadgesToBuyListProps) {
  const { t } = useTranslation();
  const { styles } = useStyles(stylesheet);
  const [expanded, setExpanded] = useState(false);

  const {
    data: items = [],
    isLoading,
    error,
  } = useBadgesToBuy(supabase, troopId);

  const totalToBuy = useMemo(
    () => items.reduce((total, item) => total + item.toBuyCount, 0),
    [items],
  );

  if (items.length === 0) return null;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={styles.loader.color} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {t("dashboard.inventory.toBuyLoadError")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setExpanded((value) => !value)}
        style={styles.header}
      >
        {expanded ? (
          <ChevronDown size={19} color={styles.title.color} />
        ) : (
          <ChevronRight size={19} color={styles.title.color} />
        )}
        <Text style={styles.title}>{t("dashboard.inventory.toBuyTitle")}</Text>
        <View style={styles.total}>
          <Text style={styles.totalText}>{totalToBuy}</Text>
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.details}>
          {items.map((item: BadgeToBuyDTO, index) => {
            const badgeDef = getBadgeById(item.badgeId);

            return (
              <View
                key={item.id}
                style={[
                  styles.row,
                  index < items.length - 1 && styles.rowSeparated,
                ]}
              >
                <Text style={styles.badgeName}>
                  {badgeDef?.name ?? item.badgeId}
                </Text>
                <Text style={styles.quantity}>
                  {t("dashboard.inventory.toBuyQuantity", {
                    count: item.toBuyCount,
                  })}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    overflow: "hidden",
  },
  centerContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    color: theme.colors.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    padding: 14,
  },
  title: {
    flex: 1,
    color: theme.colors.foreground,
    fontSize: 15,
    fontWeight: "800",
  },
  total: {
    minWidth: 28,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: theme.colors.destructive,
    alignItems: "center",
  },
  totalText: {
    color: theme.colors.background,
    fontSize: 13,
    fontWeight: "800",
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 11,
  },
  rowSeparated: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  badgeName: {
    flex: 1,
    color: theme.colors.foreground,
    fontSize: 14,
    fontWeight: "700",
  },
  quantity: {
    color: theme.colors.destructive,
    fontSize: 13,
    fontWeight: "800",
  },
  errorText: {
    color: theme.colors.destructive,
    fontSize: 13,
  },
}));
