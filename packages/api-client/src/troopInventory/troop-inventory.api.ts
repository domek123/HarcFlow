import {
  CreateInventoryItemInput,
  InventoryItem,
  UpdateInventoryItemInput,
} from "@harcapp/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const fetchTroopInventory = async (
  supabase: SupabaseClient,
  troopId: string,
): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from("InventoryItem")
    .select("*")
    .eq("troopId", troopId)
    .order("name", { ascending: true });

  if (error) {
    console.error(
      `[fetchTroopInventory] Błąd dla drużyny (${troopId}):`,
      error,
    );
    throw new Error(`Nie udało się pobrać magazynu: ${error.message}`);
  }

  return data as InventoryItem[];
};

export const createInventoryItem = async (
  supabase: SupabaseClient,
  input: CreateInventoryItemInput,
): Promise<InventoryItem> => {
  const { data, error } = await supabase
    .from("InventoryItem")
    .insert({
      name: input.name,
      amount: input.amount,
      type: input.type,
      troopId: input.troopId,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("[createInventoryItem] Błąd podczas tworzenia:", error);
    throw new Error(
      `Nie udało się dodać przedmiotu do magazynu: ${error?.message}`,
    );
  }

  return data as InventoryItem;
};

export const updateInventoryItem = async (
  supabase: SupabaseClient,
  itemId: string,
  input: UpdateInventoryItemInput,
): Promise<InventoryItem> => {
  const { data, error } = await supabase
    .from("InventoryItem")
    .update({
      ...(input.name !== undefined && { name: input.name }),
      ...(input.amount !== undefined && { amount: input.amount }),
      ...(input.type !== undefined && { type: input.type }),
    })
    .eq("id", itemId)
    .select()
    .single();

  if (error || !data) {
    console.error(`[updateInventoryItem] Błąd edycji (${itemId}):`, error);
    throw new Error(
      `Nie udało się zaktualizować przedmiotu: ${error?.message}`,
    );
  }

  return data as InventoryItem;
};

export const incrementInventoryAmount = async (
  supabase: SupabaseClient,
  itemId: string,
  delta: number,
): Promise<InventoryItem> => {
  const { data, error } = await supabase.rpc("increment_inventory_amount", {
    target_item_id: itemId,
    delta_val: delta,
  });

  if (error) {
    console.error(
      `[incrementInventoryAmount] Błąd zmiany ilości (${itemId}):`,
      error,
    );
    throw new Error(
      `Nie udało się zmienić ilości przedmiotu: ${error.message}`,
    );
  }

  return data as InventoryItem;
};

export const deleteInventoryItem = async (
  supabase: SupabaseClient,
  itemId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("InventoryItem")
    .delete()
    .eq("id", itemId);

  if (error) {
    console.error(`[deleteInventoryItem] Błąd usuwania (${itemId}):`, error);
    throw new Error(
      `Nie udało się usunąć przedmiotu z magazynu: ${error.message}`,
    );
  }
};
