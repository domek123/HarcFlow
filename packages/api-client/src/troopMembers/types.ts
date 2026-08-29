import type { ScoutProfileDTO } from "@harcapp/types";

export type AddMemberPayload = Omit<ScoutProfileDTO, "id" | "userId">;
export type UpdateMemberPayload = Omit<ScoutProfileDTO, "userId">;
