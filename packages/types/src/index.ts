import { Degree } from "@prisma/client";

export {
  Rank,
  Degree,
  Function,
  Gender,
  BadgeStatus,
  AttendanceStatus,
} from "@prisma/client";

export const DEGREE_ORDER = [
  Degree.NONE,
  Degree.DH,
  Degree.ML,
  Degree.WYW,
  Degree.CW,
  Degree.HO,
  Degree.HR,
];

export const DegreeMaxAge: Record<Degree, number> = {
  [Degree.NONE]: 10,
  [Degree.DH]: 11,
  [Degree.ML]: 13,
  [Degree.WYW]: 14,
  [Degree.CW]: 16,
  [Degree.HO]: 18,
  [Degree.HR]: 100,
};

export * from "./troopMembers";
export * from "./troop";
export * from "./patrol";
export * from "./parent";
export * from "./notes";

export * from "./badges";
export * from "./inventoryItem";
export * from "./memberBadge";
export * from "./event";
export * from "./attendance";
