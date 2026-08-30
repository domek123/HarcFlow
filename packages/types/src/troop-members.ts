import type { Rank, Degree, Function, Gender } from "@prisma/client";

export interface TroopMemberSectionDTO {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  rank: Rank;
  degree: Degree;
  function: Function;
  patrolId: string | null;
}

export interface ScoutProfileDTO {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  troopId: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: string;
  gender: Gender;
  rank: Rank;
  degree: Degree;
  function: Function;
  patrolId?: string | null;
}

export interface CreateScoutInput {
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  troopId: string;
}

export interface RawScoutProfile {
  id: string;
  userId: string;
  rank: Rank;
  degree: Degree;
  troopId: string;
  function: Function;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    birthDate?: string;
    gender?: "MALE" | "FEMALE";
  };
}
