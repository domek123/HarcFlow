import { z } from "zod";

const isoDateSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "dashboard.meetups.validation.invalidDate",
  });

export const eventItemSchema = z.object({
  id: z.string().min(1),
  troopId: z.string().min(1),
  title: z.string().trim().min(1),
  description: z.string().optional(),
  startDate: isoDateSchema,
  endDate: isoDateSchema,
  location: z.string().optional(),
  createdAt: isoDateSchema.optional(),
});

export const eventListSchema = z.array(eventItemSchema);

export const eventFormSchema = z
  .object({
    title: z.string().trim().min(2, "dashboard.meetups.validation.title"),
    description: z.string().optional(),
    startDate: isoDateSchema,
    endDate: isoDateSchema,
    location: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (
      new Date(values.endDate).getTime() <= new Date(values.startDate).getTime()
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "dashboard.meetups.validation.endAfterStart",
      });
    }
  });

export type EventFormValues = z.infer<typeof eventFormSchema>;

export const eventFormDefaultValues: EventFormValues = {
  title: "",
  description: "",
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
  location: "",
};
