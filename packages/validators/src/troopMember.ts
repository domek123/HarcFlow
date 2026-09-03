import { Gender, Function, Rank, Degree } from "@harcapp/types";
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
    birthDate: z.string().optional(),
    gender: z.nativeEnum(Gender),
    function: z.nativeEnum(Function),
    rank: z.nativeEnum(Rank),
    degree: z.nativeEnum(Degree),
    patrolId: z.string().optional(),
  });

export type AddMemberFormValues = z.infer<
  ReturnType<typeof createAddMemberSchema>
>;

export const addMemberDefaultValues: AddMemberFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  birthDate: undefined,
  gender: Gender.MALE,
  function: Function.NONE,
  rank: Rank.NONE,
  degree: Degree.NONE,
  patrolId: undefined,
};
