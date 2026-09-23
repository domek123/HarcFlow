import { useCallback, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { SegmentedSwitch } from "@/components";
import { getBadgeById } from "@harcapp/types";

import { BadgeRow } from "./components/badges/BadgeRow";
import { BadgesToBuyList } from "./components/badges/BadgesToBuyList";
import { EquipmentPanel } from "./components/equipment/EquipmentPanel";
import { QuantityInputModal } from "./components/modals/QuantityInputModal";
import { ListItem, useBadgeInventory } from "./hooks/useBadgeInventory";

type InventoryTab = "skills" | "equipment";

export function InventoryScreen() {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(stylesheet);

  const {
    searchQuery,
    setSearchQuery,
    flattenedData,
    handleBadgeCountChange,
    handleBadgeQuantitySet,
    troopId,
  } = useBadgeInventory();

  const [activeTab, setActiveTab] = useState<InventoryTab>("skills");
  const [quantityModalState, setQuantityModalState] = useState<{
    badgeId: string;
    badgeName: string;
    currentQuantity: number;
  } | null>(null);

  const handleOpenQuantityModal = useCallback(
    (badgeId: string, currentQuantity: number) => {
      const badgeName = getBadgeById(badgeId)?.name || "";

      setQuantityModalState({
        badgeId,
        badgeName,
        currentQuantity,
      });
    },
    [],
  );

  const handleQuantitySubmit = useCallback(
    (targetQuantity: number) => {
      if (!quantityModalState) return;

      handleBadgeQuantitySet(
        quantityModalState.badgeId,
        targetQuantity,
        quantityModalState.currentQuantity,
      );
      setQuantityModalState(null);
    },
    [handleBadgeQuantitySet, quantityModalState],
  );

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === "header") {
        return <Text style={styles.categoryTitle}>{item.title}</Text>;
      }

      return (
        <BadgeRow
          badge={item.data}
          quantity={item.data.quantity}
          onCountChange={handleBadgeCountChange}
          onOpenQuantityModal={handleOpenQuantityModal}
        />
      );
    },
    [handleBadgeCountChange, handleOpenQuantityModal, styles.categoryTitle],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("dashboard.inventory.title")}</Text>
        <SegmentedSwitch
          activeKey={activeTab}
          options={[
            { key: "skills", label: t("dashboard.inventory.tabs.skills") },
            {
              key: "equipment",
              label: t("dashboard.inventory.tabs.equipment"),
            },
          ]}
          onChange={setActiveTab}
        />

        {activeTab === "skills" ? (
          <View style={styles.listContainer}>
            <BadgesToBuyList troopId={troopId} />
            <View style={styles.searchWrap}>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t("dashboard.inventory.searchPlaceholder")}
                placeholderTextColor={theme.colors.mutedForeground}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.searchInput}
              />
            </View>
            <FlashList
              data={flattenedData}
              renderItem={renderItem}
              getItemType={(item) => item.type}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.flashListContent}
              ListEmptyComponent={
                <View style={styles.emptyPanel}>
                  <Text style={styles.emptyPanelText}>
                    {searchQuery.trim()
                      ? t("dashboard.inventory.noBadgesMatch")
                      : t("dashboard.inventory.noBadges")}
                  </Text>
                </View>
              }
            />

            {quantityModalState && (
              <QuantityInputModal
                visible={Boolean(quantityModalState)}
                badgeName={quantityModalState.badgeName}
                currentQuantity={quantityModalState.currentQuantity}
                onClose={() => setQuantityModalState(null)}
                onSubmit={handleQuantitySubmit}
              />
            )}
          </View>
        ) : (
          <EquipmentPanel />
        )}
      </View>
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.foreground,
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
  searchWrap: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.foreground,
    fontSize: 14,
  },
  flashListContent: {
    paddingBottom: 24,
  },
  categoryTitle: {
    color: theme.colors.foreground,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
  },
  emptyPanel: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 18,
    padding: 18,
  },
  emptyPanelText: {
    color: theme.colors.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
  },
}));
