import { useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";
import {
  useCreateInventoryItem,
  useDeleteInventoryItem,
  useFetchTroopInventory,
  useIncrementInventoryAmount,
  useUpdateInventoryItem,
} from "@harcapp/api-client";
import { InventoryItemType, type InventoryItem } from "@harcapp/types";
import type { InventoryItemFormValues } from "@harcapp/validators";

export type InventoryCategory = InventoryItemType | "ALL";

export function useEquipmentInventory() {
  const { t } = useTranslation();
  const { id: troopId } = useParams<{ id: string }>();

  const inventoryQuery = useFetchTroopInventory(supabase, troopId);

  const createItem = useCreateInventoryItem(supabase, troopId ?? "");
  const updateItem = useUpdateInventoryItem(supabase, troopId ?? "");
  const incrementItem = useIncrementInventoryAmount(supabase, troopId ?? "");
  const deleteItem = useDeleteInventoryItem(supabase, troopId ?? "");

  const [inventorySearch, setInventorySearch] = useState("");
  const [category, setCategory] = useState<InventoryCategory>("ALL");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialogItem, setDeleteDialogItem] =
    useState<InventoryItem | null>(null);

  const visibleItems = useMemo(() => {
    const query = inventorySearch.trim().toLowerCase();
    return (inventoryQuery.data ?? []).filter(
      (item) =>
        (!query || item.name.toLowerCase().includes(query)) &&
        (category === "ALL" || item.type === category),
    );
  }, [category, inventoryQuery.data, inventorySearch]);

  const handleSubmitItem = (values: InventoryItemFormValues) => {
    const mutation = editingItem ? updateItem.mutate : createItem.mutate;
    const variables = editingItem
      ? { id: editingItem.id, input: values }
      : { ...values, troopId: troopId };

    mutation(variables as never, {
      onSuccess: () => {
        closeForm();
        toast.success(
          editingItem
            ? t("warehouse.toast.updated")
            : t("warehouse.toast.added"),
        );
      },
      onError: () => toast.error(t("warehouse.toast.saveError")),
    });
  };

  const handleDelete = () => {
    if (!deleteDialogItem) return;

    deleteItem.mutate(deleteDialogItem.id, {
      onSuccess: () => {
        setDeleteDialogItem(null);
        toast.success(t("warehouse.toast.deleted"));
      },
      onError: () => toast.error(t("warehouse.toast.deleteError")),
    });
  };

  const openCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };
  const openEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };
  const closeForm = () => {
    setEditingItem(null);
    setIsFormOpen(false);
  };

  return {
    troopId,
    inventoryQuery,
    inventorySearch,
    setInventorySearch,
    category,
    setCategory,
    visibleItems,
    editingItem,
    isFormOpen,
    openCreate,
    openEdit,
    closeForm,
    createItem,
    updateItem,
    incrementItem,
    deleteItem,
    deleteDialogItem,
    setDeleteDialogItem,
    handleSubmitItem,
    handleDelete,
  };
}
