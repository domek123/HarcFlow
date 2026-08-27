import type { TroopDTO } from "@harcapp/types";

export interface RawTroopWithProfileCount {
  id: string;
  name: string;
  description: string | null;
  creationYear: number;
  ScoutProfile: { count: number }[];
}

export type CreateTroopPayload = Partial<Omit<TroopDTO, "id" | "memberCount">>;

export interface UpdateTroopArgs {
  id: string;
  dto: Partial<Omit<TroopDTO, "id" | "memberCount">>;
}
