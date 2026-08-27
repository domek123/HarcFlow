import { z } from "zod";

export const createTroopSchema = z.object({
  name: z.string().min(3, "Nazwa musi mieć min. 3 znaki"),
  description: z.string().optional(),
});

export type CreateTroopInput = z.infer<typeof createTroopSchema>;

export const defaultValues = {
  name: "",
  description: "",
};

export const updateTroopSchema = z.object({
  name: z
    .string()
    .min(1, { message: "troopDetails.validation.nameRequired" })
    .min(3, { message: "troopDetails.validation.nameMin" })
    .max(100, { message: "troopDetails.validation.nameMax" }),

  description: z
    .string()
    .max(500, { message: "troopDetails.validation.descriptionMax" })
    .optional()
    .or(z.literal("")),

  creationYear: z
    .number({
      invalid_type_error: "troopDetails.validation.yearInvalid",
    })
    .int({ message: "troopDetails.validation.yearInteger" })
    .min(1900, { message: "troopDetails.validation.yearMin" })
    .max(new Date().getFullYear(), {
      message: "troopDetails.validation.yearMax",
    })
    .optional(),
});

export type UpdateTroopFormValues = z.infer<typeof updateTroopSchema>;
