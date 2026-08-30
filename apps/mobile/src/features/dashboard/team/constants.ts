export const PATROL_DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const;

export const genderOptions = [
  { value: "MALE", labelKey: "enums.gender.MALE" },
  { value: "FEMALE", labelKey: "enums.gender.FEMALE" },
] as const;

export const functionOptions = [
  { value: "NONE", labelKey: "enums.function.NONE" },
  { value: "PODZASTEPOWY", labelKey: "enums.function.PODZASTEPOWY" },
  { value: "ZASTEPOWY", labelKey: "enums.function.ZASTEPOWY" },
  { value: "PRZYBOCZNY", labelKey: "enums.function.PRZYBOCZNY" },
  { value: "DRUZYNOWY", labelKey: "enums.function.DRUZYNOWY" },
] as const;

export const rankOptions = [
  { value: "NONE", labelKey: "enums.rank.NONE" },
  { value: "PRZEWODNIK", labelKey: "enums.rank.PRZEWODNIK" },
  { value: "PODHARCMISTRZ", labelKey: "enums.rank.PODHARCMISTRZ" },
  { value: "HARCMISTRZ", labelKey: "enums.rank.HARCMISTRZ" },
] as const;

export const degreeOptions = [
  { value: "NONE", labelKey: "enums.degree.NONE" },
  { value: "DH", labelKey: "enums.degree.DH" },
  { value: "ML", labelKey: "enums.degree.ML" },
  { value: "WYW", labelKey: "enums.degree.WYW" },
  { value: "CW", labelKey: "enums.degree.CW" },
  { value: "HO", labelKey: "enums.degree.HO" },
  { value: "HR", labelKey: "enums.degree.HR" },
] as const;
