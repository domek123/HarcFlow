import type { ScoutProfileDTO, Rank, Degree, Function } from "@harcapp/types";

export interface RawScoutProfile {
  id: string;
  userId: string;
  rank: Rank;
  degree: Degree;
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

export type AddMemberPayload = Omit<ScoutProfileDTO, "id" | "userId">;
export type UpdateMemberPayload = Omit<ScoutProfileDTO, "userId">;
