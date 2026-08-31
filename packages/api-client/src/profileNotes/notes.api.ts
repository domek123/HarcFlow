import { ScoutNoteDTO, CreateScoutNoteInput } from "@harcapp/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function fetchScoutNotes(
  supabase: SupabaseClient,
  profileId: string,
): Promise<ScoutNoteDTO[]> {
  if (!profileId) return [];

  const { data, error } = await supabase
    .from("ScoutNote")
    .select(
      `
      id,
      content,
      createdAt,
      authorId,
      profileId,
      author:User!authorId (
        firstName,
        lastName
      )
    `,
    )
    .eq("profileId", profileId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error(`Błąd pobierania notatek dla profilu (${profileId}):`, error);
    throw error;
  }

  return (data ?? []).map((note) => {
    const authorObj = Array.isArray(note.author) ? note.author[0] : note.author;
    const firstName = authorObj?.firstName ?? "";
    const lastName = authorObj?.lastName ?? "";

    return {
      id: note.id,
      content: note.content,
      createdAt: note.createdAt,
      authorId: note.authorId,
      authorName: `${firstName} ${lastName}`.trim() || "Nieznany autor",
      profileId: note.profileId,
    };
  });
}

export async function createScoutNote(
  supabase: SupabaseClient,
  input: CreateScoutNoteInput,
): Promise<ScoutNoteDTO> {
  const { data, error } = await supabase
    .from("ScoutNote")
    .insert({
      content: input.content,
      profileId: input.profileId,
      authorId: input.authorId,
    })
    .select(
      `
      id,
      content,
      createdAt,
      authorId,
      profileId,
      author:User!authorId (
        firstName,
        lastName
      )
    `,
    )
    .single();

  if (error || !data) {
    console.error("Błąd podczas tworzenia notatki:", error);
    throw error;
  }

  const authorObj = Array.isArray(data.author) ? data.author[0] : data.author;

  return {
    id: data.id,
    content: data.content,
    createdAt: data.createdAt,
    authorId: data.authorId,
    authorName:
      `${authorObj?.firstName ?? ""} ${authorObj?.lastName ?? ""}`.trim() ||
      "Nieznany autor",
    profileId: data.profileId,
  };
}

export async function deleteScoutNote(
  supabase: SupabaseClient,
  noteId: string,
): Promise<void> {
  const { error } = await supabase.from("ScoutNote").delete().eq("id", noteId);

  if (error) {
    console.error(`Błąd usuwania notatki (${noteId}):`, error);
    throw error;
  }
}
