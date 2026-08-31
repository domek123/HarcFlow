import { SupabaseClient } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createScoutNote, deleteScoutNote, fetchScoutNotes } from "./notes.api";
import { scoutNotesKeys } from "../keys";
import { CreateScoutNoteInput } from "@harcapp/types";

export const useFetchScoutNotes = (
  supabase: SupabaseClient,
  profileId?: string,
) => {
  return useQuery({
    queryKey: scoutNotesKeys.list(profileId),
    queryFn: () => fetchScoutNotes(supabase, profileId!),
    enabled: !!profileId,
  });
};

export const useCreateScoutNote = (supabase: SupabaseClient) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateScoutNoteInput) =>
      createScoutNote(supabase, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: scoutNotesKeys.list(variables.profileId),
      });
    },
  });
};

export const useDeleteScoutNote = (
  supabase: SupabaseClient,
  profileId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => deleteScoutNote(supabase, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scoutNotesKeys.list(profileId),
      });
    },
  });
};
