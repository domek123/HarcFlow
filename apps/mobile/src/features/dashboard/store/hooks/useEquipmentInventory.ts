import { useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { supabase } from "@/lib/supabase";
import { showToast } from "@/utils/toast";
import {
  useFetchCurrentScoutProfile,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useIncrementInventoryAmount,
  useDeleteInventoryItem,
  useFetchTroopInventory,
} from "@harcapp/api-client";
import { InventoryItem, InventoryItemType } from "@harcapp/types";
import { InventoryItemFormValues } from "@harcapp/validators";
type InventoryCategory = InventoryItemType | "ALL";

export function useEquipmentInventory() {
  const { t } = useTranslation();
  const { data: profile } = useFetchCurrentScoutProfile(supabase);
  const troopId = profile?.troopId;

  const inventoryQuery = useFetchTroopInventory(supabase, troopId);
  const { mutate: createMutation, isPending: isCreatePending } =
    useCreateInventoryItem(supabase, troopId ?? "");
  const { mutate: updateMutation, isPending: isUpdatePending } =
    useUpdateInventoryItem(supabase, troopId ?? "");
  const { mutate: incrementMutation } = useIncrementInventoryAmount(
    supabase,
    troopId ?? "",
  );
  const { mutate: deleteMutation, isPending: isDeletePending } =
    useDeleteInventoryItem(supabase, troopId ?? "");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<InventoryCategory>("ALL");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deleteDialogItem, setDeleteDialogItem] =
    useState<InventoryItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const items = useMemo(() => {
    if (!inventoryQuery.data) return [];

    const query = search.trim().toLowerCase();

    return inventoryQuery.data.filter((item) => {
      const matchesSearch = !query || item.name.toLowerCase().includes(query);
      const matchesCategory = category === "ALL" || item.type === category;
      return matchesSearch && matchesCategory;
    });
  }, [category, search, inventoryQuery.data]);

  const openCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const changeAmount = (item: InventoryItem, delta: number) => {
    incrementMutation({ itemId: item.id, delta });
  };

  const deleteItem = (item: InventoryItem) => {
    setDeleteDialogItem(item);
  };

  const closeDeleteDialog = () => {
    if (!isDeletePending) setDeleteDialogItem(null);
  };

  const confirmDelete = () => {
    if (!deleteDialogItem) return;

    deleteMutation(deleteDialogItem.id, {
      onSuccess: () => {
        showToast.success(t("dashboard.inventory.deleteSuccess"));
        setDeleteDialogItem(null);
      },
      onError: () => showToast.error(t("dashboard.inventory.deleteError")),
    });
  };

  const submitForm = (values: InventoryItemFormValues) => {
    if (!troopId) return;
    const onSuccess = () => {
      showToast.success(
        t(
          editingItem
            ? "dashboard.inventory.updateSuccess"
            : "dashboard.inventory.createSuccess",
        ),
      );
      closeForm();
    };
    const onError = () =>
      showToast.error(
        t(
          editingItem
            ? "dashboard.inventory.updateError"
            : "dashboard.inventory.createError",
        ),
      );

    if (editingItem) {
      updateMutation(
        { id: editingItem.id, input: values },
        { onSuccess, onError },
      );
    } else {
      createMutation({ ...values, troopId }, { onSuccess, onError });
    }
  };

  return {
    category,
    closeForm,
    closeDeleteDialog,
    confirmDelete,
    deleteItem,
    deleteDialogItem,
    editingItem,
    inventoryQuery,
    isFormOpen,
    isPending: isCreatePending || isUpdatePending,
    isDeletePending,
    items,
    changeAmount,
    openCreate,
    openEdit,
    search,
    setCategory,
    setSearch,
    submitForm,
  };
}
