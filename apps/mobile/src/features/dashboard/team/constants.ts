import { Degree, Function, Gender, Rank } from "@harcapp/types";

export const PATROL_DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const;

export function createEnumOptions<
  T extends Record<string, string>,
  K extends string,
>(enumObj: T, prefix: K) {
  return (Object.values(enumObj).reverse() as Array<T[keyof T]>).map(
    (value) => ({
      value,
      labelKey: `${prefix}.${value}` as const,
    }),
  );
}

export const genderOptions = createEnumOptions(Gender, "enums.gender");
export const functionOptions = createEnumOptions(Function, "enums.function");
export const rankOptions = createEnumOptions(Rank, "enums.rank");
export const degreeOptions = createEnumOptions(Degree, "enums.degree");
