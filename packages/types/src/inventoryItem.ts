import type { InventoryItem } from "@prisma/client";

export type { InventoryItem } from "@prisma/client";
export { InventoryItemType } from "@prisma/client";

export type CreateInventoryItemInput = Omit<InventoryItem, "id">;

export type UpdateInventoryItemInput = Partial<InventoryItem>;
