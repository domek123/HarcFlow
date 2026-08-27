import * as z from "zod";

type TranslateFn = (key: string) => string;

export const createAddMemberSchema = (t: TranslateFn) =>
  z.object({
    firstName: z
      .string()
      .min(1, t("troopDetails.addModal.errors.firstNameRequired")),
    lastName: z
      .string()
      .min(1, t("troopDetails.addModal.errors.lastNameRequired")),
    email: z
      .string()
      .email(t("troopDetails.addModal.errors.emailInvalid"))
      .optional()
      .or(z.literal("")),
    phoneNumber: z
      .string()
      .regex(/^[0-9+ \-()]*$/, t("troopDetails.addModal.errors.phoneInvalid"))
      .optional()
      .or(z.literal("")),
    birthDate: z
      .string()
      .min(1, t("troopDetails.addModal.errors.birthDateRequired")),
    gender: z.enum(["MALE", "FEMALE"]),
    function: z.enum([
      "DRUZYNOWY",
      "PRZYBOCZNY",
      "ZASTEPOWY",
      "PODZASTEPOWY",
      "NONE",
    ]),
    rank: z.enum(["HARCMISTRZ", "PODHARCMISTRZ", "PRZEWODNIK", "NONE"]),
    degree: z.enum(["HR", "HO", "CW", "WYW", "ML", "DH", "NONE"]),
  });

export type AddMemberFormValues = z.infer<
  ReturnType<typeof createAddMemberSchema>
>;
