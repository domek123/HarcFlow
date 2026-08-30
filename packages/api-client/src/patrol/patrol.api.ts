import { CreatePatrolPayload, PatrolDTO } from "@harcapp/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function createPatrol(
  supabase: SupabaseClient,
  payload: CreatePatrolPayload,
): Promise<PatrolDTO> {
  const { data, error } = await supabase
    .from("ScoutPatrol")
    .insert([payload])
    .select("*")
    .single();

  if (error) throw error;
  return data as PatrolDTO;
}

export async function deletePatrol(
  supabase: SupabaseClient,
  patrolId: string,
): Promise<void> {
  const { error } = await supabase
    .from("ScoutPatrol")
    .delete()
    .eq("id", patrolId);

  if (error) throw error;
}

export async function updatePatrol(
  supabase: SupabaseClient,
  dto: Partial<PatrolDTO>,
): Promise<PatrolDTO> {
  const { data, error } = await supabase
    .from("ScoutPatrol")
    .update(dto)
    .eq("id", dto.id)
    .select()
    .single();

  if (error) throw error;
  return data as PatrolDTO;
}
