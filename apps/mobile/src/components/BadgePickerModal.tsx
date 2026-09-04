import { memo, useCallback, useMemo, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { Search, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Badge, SCOUT_BADGES } from "@harcapp/types";

interface BadgePickerModalProps {
  visible: boolean;
  selectedBadgeId?: string;
  excludedBadgeIds?: string[];
  onClose: () => void;
  onSelect: (badge: Badge) => void;
}

interface BadgeOptionRowProps {
  item: Badge;
  isSelected: boolean;
  isLast: boolean;
  onSelect: (badge: Badge) => void;
}

const BadgeOptionRow = memo(function BadgeOptionRow({
  item,
  isSelected,
  isLast,
  onSelect,
}: BadgeOptionRowProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Pressable
      onPress={() => onSelect(item)}
      style={({ pressed }) => [
        styles.badgeRow,
        isLast && styles.noBorder,
        isSelected && styles.selectedRow,
        pressed && styles.pressedRow,
      ]}
    >
      <View style={styles.badgeText}>
        <Text style={styles.badgeName}>{item.name}</Text>
      </View>
      <Text style={styles.level}>{item.level ? `L${item.level}` : "W"}</Text>
    </Pressable>
  );
});

export function BadgePickerModal({
  visible,
  selectedBadgeId,
  excludedBadgeIds = [],
  onClose,
  onSelect,
}: BadgePickerModalProps) {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(stylesheet);

  const [search, setSearch] = useState("");

  const handleClose = useCallback(() => {
    setSearch("");
    onClose();
  }, [onClose]);

  const handleSelectBadge = useCallback(
    (badge: Badge) => {
      onSelect(badge);
      handleClose();
    },
    [handleClose, onSelect],
  );

  const filteredBadges = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pl");

    const availableBadges = SCOUT_BADGES.filter(
      (badge) => !excludedBadgeIds.includes(badge.id),
    );

    if (!query) return availableBadges;

    return availableBadges.filter((badge) =>
      `${badge.name}`.toLocaleLowerCase("pl").startsWith(query),
    );
  }, [excludedBadgeIds, search]);

  const renderItem = useCallback(
    ({ item, index }: { item: Badge; index: number }) => (
      <BadgeOptionRow
        item={item}
        isSelected={item.id === selectedBadgeId}
        isLast={index === filteredBadges.length - 1}
        onSelect={handleSelectBadge}
      />
    ),
    [selectedBadgeId, filteredBadges.length, handleSelectBadge],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {t("dashboard.team.badges.choose")}
            </Text>
            <Pressable
              accessibilityLabel={t("common.close")}
              onPress={handleClose}
              style={styles.iconButton}
            >
              <X size={20} color={theme.colors.foreground} />
            </Pressable>
          </View>

          <View style={styles.searchBox}>
            <Search size={18} color={theme.colors.mutedForeground} />
            <TextInput
              autoFocus
              value={search}
              onChangeText={setSearch}
              placeholder={t("dashboard.team.badges.search")}
              placeholderTextColor={theme.colors.mutedForeground}
              style={styles.searchInput}
            />
          </View>

          <View style={styles.listWrapper}>
            <FlashList
              data={filteredBadges}
              keyExtractor={(badge) => badge.id}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <Text style={styles.empty}>
                  {t("dashboard.team.badges.noMatch")}
                </Text>
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    padding: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: {
    color: theme.colors.foreground,
    fontSize: 20,
    fontWeight: "800",
  },
  iconButton: {
    padding: 6,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.foreground,
    paddingVertical: 11,
  },
  listWrapper: {
    flex: 1,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 20,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  selectedRow: {
    backgroundColor: theme.colors.background,
  },
  pressedRow: {
    opacity: 0.7,
  },
  badgeText: {
    flex: 1,
    marginRight: 12,
  },
  badgeName: {
    color: theme.colors.foreground,
    fontSize: 15,
    fontWeight: "600",
  },
  level: {
    color: theme.colors.primary,
    fontWeight: "800",
    fontSize: 13,
  },
  empty: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
    padding: 24,
  },
}));
