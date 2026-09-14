import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";

import { Search, X, PackageOpen, Plus, RotateCcw } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { DeleteModal } from "@/components";

import { useEquipmentInventory } from "../../hooks/useEquipmentInventory";
import { InventoryFormModal } from "../modals/InventoryFormModal";
import { CategoryFilter } from "./CategoryFilter";
import { InventoryCard } from "./InventoryCard";

export function EquipmentPanel() {
  const { t } = useTranslation();
  const { styles, theme } = useStyles(stylesheet);
  const inventory = useEquipmentInventory();

  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsManualRefreshing(true);
    await inventory.inventoryQuery.refetch();
    setIsManualRefreshing(false);
  }, [inventory.inventoryQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <View style={styles.statsRow}>
          <View style={styles.searchWrap}>
            <Search size={18} color={theme.colors.mutedForeground} />
            <TextInput
              value={inventory.search}
              onChangeText={inventory.setSearch}
              placeholder={t("dashboard.inventory.searchEquipment")}
              placeholderTextColor={theme.colors.mutedForeground}
              style={styles.searchInput}
            />
            {inventory.search.length > 0 && (
              <Pressable onPress={() => inventory.setSearch("")}>
                <X size={18} color={theme.colors.mutedForeground} />
              </Pressable>
            )}
          </View>
          <Pressable
            accessibilityLabel={t("dashboard.inventory.addItem")}
            style={styles.addButton}
            onPress={inventory.openCreate}
          >
            <Plus size={20} color={theme.colors.primaryForeground} />
          </Pressable>
        </View>
        <CategoryFilter
          selected={inventory.category}
          onSelect={inventory.setCategory}
        />
      </View>

      {inventory.inventoryQuery.isLoading ? (
        <LoadingState
          styles={styles}
          label={t("dashboard.inventory.loading")}
        />
      ) : inventory.inventoryQuery.isError ? (
        <View style={styles.statePanel}>
          <RotateCcw size={28} color={theme.colors.primary} />
          <Text style={styles.stateText}>
            {t("dashboard.inventory.loadError")}
          </Text>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => inventory.inventoryQuery.refetch()}
          >
            <Text style={styles.secondaryButtonText}>
              {t("dashboard.inventory.retry")}
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={inventory.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <InventoryCard
              item={item}
              onIncrement={() => inventory.changeAmount(item, 1)}
              onDecrement={() => inventory.changeAmount(item, -1)}
              onEdit={() => inventory.openEdit(item)}
              onDelete={() => inventory.deleteItem(item)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isManualRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          }
          contentContainerStyle={
            inventory.items.length ? styles.listContent : styles.emptyContent
          }
          ListEmptyComponent={
            <View style={styles.statePanel}>
              <PackageOpen size={42} color={theme.colors.mutedForeground} />
              <Text style={styles.stateTitle}>
                {t("dashboard.inventory.emptyTitle")}
              </Text>
              <Text style={styles.stateText}>
                {t("dashboard.inventory.emptyMessage")}
              </Text>
              <Pressable
                style={styles.primaryButton}
                onPress={inventory.openCreate}
              >
                <Plus size={18} color={theme.colors.primaryForeground} />
                <Text style={styles.primaryButtonText}>
                  {t("dashboard.inventory.addFirst")}
                </Text>
              </Pressable>
            </View>
          }
        />
      )}
      <InventoryFormModal
        visible={inventory.isFormOpen}
        item={inventory.editingItem}
        isPending={inventory.isPending}
        onClose={inventory.closeForm}
        onSubmit={inventory.submitForm}
      />
      <DeleteModal
        titleMessage={t("dashboard.inventory.deleteTitle")}
        contentMessage={
          inventory.deleteDialogItem
            ? t("dashboard.inventory.deleteMessage", {
                name: inventory.deleteDialogItem.name,
              })
            : null
        }
        isOpen={inventory.deleteDialogItem !== null}
        isPending={inventory.isDeletePending}
        onCancel={inventory.closeDeleteDialog}
        onConfirm={inventory.confirmDelete}
      />
    </View>
  );
}

function LoadingState({
  styles,
  label,
}: {
  styles: { loading: object; stateText: object };
  label: string;
}) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator />
      <Text style={styles.stateText}>{label}</Text>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    gap: 12,
  },
  panel: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 18,
    padding: 18,
    gap: 12,
  },
  panelTitle: {
    color: theme.colors.foreground,
    fontSize: 22,
    fontWeight: "700",
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  statsRow: { flexDirection: "row", gap: 10 },
  stat: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: {
    color: theme.colors.foreground,
    fontSize: 24,
    fontWeight: "800",
  },
  statLabel: {
    color: theme.colors.mutedForeground,
    fontSize: 12,
    marginTop: 2,
  },
  warningText: { color: theme.colors.destructive },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.foreground,
    paddingVertical: 11,
    fontSize: 14,
  },
  listContent: { paddingBottom: 24, gap: 10 },
  emptyContent: { flexGrow: 1, justifyContent: "center" },
  statePanel: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 24,
  },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  stateTitle: {
    color: theme.colors.foreground,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  stateText: {
    color: theme.colors.mutedForeground,
    fontSize: 14,
    textAlign: "center",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 11,
    marginTop: 4,
  },
  primaryButtonText: {
    color: theme.colors.primaryForeground,
    fontWeight: "700",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 11,
  },
  secondaryButtonText: { color: theme.colors.foreground, fontWeight: "700" },
}));
