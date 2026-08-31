import { z } from "zod";

type TranslateFn = (key: string) => string;

export const createParentSchema = (t: TranslateFn) =>
  z.object({
    firstName: z
      .string()
      .trim()
      .min(1, t("dashboard.memberDetails.validation.firstNameRequired")),
    lastName: z
      .string()
      .trim()
      .min(1, t("dashboard.memberDetails.validation.lastNameRequired")),
    phoneNumber: z
      .string()
      .trim()
      .regex(
        /^[0-9+ \-()]*$/,
        t("dashboard.memberDetails.validation.phoneInvalid"),
      ),
    email: z
      .string()
      .trim()
      .email(t("dashboard.memberDetails.validation.emailInvalid"))
      .or(z.literal("")),
  });

export type ParentFormData = z.infer<ReturnType<typeof createParentSchema>>;

export const parentDefaultValues: ParentFormData = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
};
