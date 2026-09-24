import { InventoryItemType } from "@harcapp/types";

import type { InventoryCategory } from "../hooks/useEquipmentInventory";

export const categoryLabelKeys: Record<InventoryCategory, string> = {
  ALL: "warehouse.types.all",
  [InventoryItemType.EQUIPMENT]: "warehouse.types.equipment",
  [InventoryItemType.UNIFORM]: "warehouse.types.uniform",
};
