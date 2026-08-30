import { SupabaseClient } from "@supabase/supabase-js";
import type { PatrolDTO, TroopDTO, TroopWithPatrolsDTO } from "@harcapp/types";
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
    .select("*, ScoutProfile(count)")
    .eq("id", troopId)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    creationYear: data.creationYear,
    memberCount: data.ScoutProfile[0]?.count || 0,
  } as TroopDTO;
}

export async function fetchTroopDetailsWithPatrols(
  supabase: SupabaseClient,
  troopId: string,
): Promise<TroopWithPatrolsDTO> {
  const { data, error } = await supabase
    .from("ScoutTroop")
    .select("*, ScoutProfile(count), ScoutPatrol(*)")
    .eq("id", troopId)
    .single();

  if (error || !data) {
    throw error || new Error("Nie znaleziono drużyny o podanym ID");
  }

  const scoutProfiles = data.ScoutProfile as unknown as
    { count: number }[] | null;
  const memberCount = scoutProfiles?.[0]?.count ?? 0;

  const patrols: PatrolDTO[] = (data.ScoutPatrol || []).map(
    (patrol: PatrolDTO) => ({
      id: patrol.id,
      name: patrol.name,
      assemblyDay: patrol.assemblyDay,
      assemblyTime: patrol.assemblyTime,
    }),
  );

  return {
    id: data.id,
    name: data.name,
    memberCount,
    patrols,
  };
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
