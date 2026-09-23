import { createEnumOptions } from "@/utils/createEnumOptions";
import { Degree, Function, Gender, Rank } from "@harcapp/types";

export const PATROL_DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const;

export const genderOptions = createEnumOptions(Gender, "enums.gender");
export const functionOptions = createEnumOptions(Function, "enums.function");
export const rankOptions = createEnumOptions(Rank, "enums.rank");
export const degreeOptions = createEnumOptions(Degree, "enums.degree");

export const DegreeMaxAge: Record<Degree, number> = {
  [Degree.NONE]: 10,
  [Degree.DH]: 11,
  [Degree.ML]: 13,
  [Degree.WYW]: 14,
  [Degree.CW]: 16,
  [Degree.HO]: 18,
  [Degree.HR]: 100,
};
