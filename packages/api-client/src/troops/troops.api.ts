import { SupabaseClient } from "@supabase/supabase-js";
import type { TroopDTO } from "@harcapp/types";
import type {
  RawTroopWithProfileCount,
  CreateTroopPayload,
  UpdateTroopArgs,
} from "./types";

export async function fetchTroops(
  supabase: SupabaseClient,
): Promise<TroopDTO[]> {
  const { data, error } = await supabase
    .from("ScoutTroop")
    .select("*, ScoutProfile(count)")
    .order("name", { ascending: true });

  if (error) throw error;

  const rawData = data as unknown as RawTroopWithProfileCount[];

  return rawData.map((troop) => ({
    id: troop.id,
    name: troop.name,
    description: troop.description,
    creationYear: troop.creationYear,
    memberCount: troop.ScoutProfile[0]?.count || 0,
  })) as TroopDTO[];
}

export async function fetchTroopDetails(
  supabase: SupabaseClient,
  troopId: string,
): Promise<TroopDTO> {
  const { data, error } = await supabase
    .from("ScoutTroop")
    .select("*")
    .eq("id", troopId)
    .single();

  if (error) throw error;
  return data as TroopDTO;
}

export async function createTroop(
  supabase: SupabaseClient,
  payload: CreateTroopPayload,
): Promise<TroopDTO> {
  const { data, error } = await supabase
    .from("ScoutTroop")
    .insert([payload])
    .select("*")
    .single();

  if (error) throw error;
  return data as TroopDTO;
}

export async function deleteTroop(
  supabase: SupabaseClient,
  troopId: string,
): Promise<void> {
  const { error } = await supabase
    .from("ScoutTroop")
    .delete()
    .eq("id", troopId);

  if (error) throw error;
}

export async function updateTroop(
  supabase: SupabaseClient,
  { id, dto }: UpdateTroopArgs,
): Promise<TroopDTO> {
  const { data, error } = await supabase
    .from("ScoutTroop")
    .update(dto)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as TroopDTO;
}
