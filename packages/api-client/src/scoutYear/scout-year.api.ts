import { SupabaseClient } from "@supabase/supabase-js";
import {
  CreateScoutYearPayload,
  ScoutYearDTO,
  ScoutYearWithCurrentFlagDTO,
} from "@harcapp/types";

function isCurrentScoutYear(scoutYear: ScoutYearDTO): boolean {
  const currentDate = new Date();
  const startDate = new Date(scoutYear.startDate);
  const endDate = new Date(scoutYear.endDate);
  return currentDate >= startDate && currentDate <= endDate;
}

export async function fetchScoutYears(
  supabase: SupabaseClient,
): Promise<ScoutYearWithCurrentFlagDTO[]> {
  const { data, error } = await supabase
    .from("ScoutYear")
    .select("*")
    .order("startDate", { ascending: false });

  if (error) throw error;

  const scoutYears = data.map((scoutYear: ScoutYearDTO) => {
    const isCurrent = isCurrentScoutYear(scoutYear);
    return {
      ...scoutYear,
      isCurrent,
    };
  });

  return scoutYears;
}

export async function fetchCurrentScoutYear(
  supabase: SupabaseClient,
): Promise<ScoutYearDTO | null> {
  const data = await fetchScoutYears(supabase);
  const currentScoutYear = data.find((scoutYear) => scoutYear.isCurrent);

  if (!currentScoutYear) {
    return null;
  }

  const { isCurrent, ...rest } = currentScoutYear;
  return rest;
}

export async function createScoutYear(
  supabase: SupabaseClient,
  payload: CreateScoutYearPayload,
): Promise<ScoutYearWithCurrentFlagDTO> {
  const { data, error } = await supabase
    .from("ScoutYear")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  const isCurrent = isCurrentScoutYear(data);

  return {
    ...data,
    isCurrent,
  };
}

export async function deleteScoutYear(
  supabase: SupabaseClient,
  scoutYearId: string,
): Promise<void> {
  const { error } = await supabase
    .from("ScoutYear")
    .delete()
    .eq("id", scoutYearId);

  if (error) throw error;
}
