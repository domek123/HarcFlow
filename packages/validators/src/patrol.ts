import z from "zod";

export const updatePatrolSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "dashboard.team.editPatrolValidation.name" })
    .max(60, { message: "dashboard.team.editPatrolValidation.nameMax" }),
  assemblyDay: z
    .number({
      invalid_type_error: "dashboard.team.editPatrolValidation.day",
    })
    .int({ message: "dashboard.team.editPatrolValidation.day" })
    .min(1, { message: "dashboard.team.editPatrolValidation.day" })
    .max(7, { message: "dashboard.team.editPatrolValidation.day" }),
  assemblyTime: z.string({
    invalid_type_error: "dashboard.team.editPatrolValidation.time",
  }),
});

export type UpdatePatrolFormValues = z.infer<typeof updatePatrolSchema>;
