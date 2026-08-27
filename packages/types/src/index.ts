import type { Rank, Degree, Function } from "@prisma/client";

export type { Rank, Degree, Function };

export type BadgeStatus = "PLANNED" | "OPENED" | "CLOSED";

export interface ScoutProfileDTO {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  birthDate: string;
  gender: "MALE" | "FEMALE";
  rank: Rank;
  degree: Degree;
  function: Function;
}

export interface TroopDTO {
  id: string;
  name: string;
  description?: string;
  creationYear: number;
  memberCount: number;
}

export interface MeritBadgeDTO {
  id: string;
  name: string;
  level: number;
  status: BadgeStatus;
}

export interface CreateScoutInput {
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  troopId: string;
}
