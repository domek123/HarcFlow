import { InventoryItemType } from "@harcapp/types";
import { z } from "zod";

export const inventoryItemSchema = z.object({
  name: z.string().trim().min(1),
  type: z.nativeEnum(InventoryItemType),
  amount: z.number().int().min(0),
});

export type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>;

export const inventoryItemDefaultValues: InventoryItemFormValues = {
  name: "",
  type: InventoryItemType.EQUIPMENT,
  amount: 0,
};
