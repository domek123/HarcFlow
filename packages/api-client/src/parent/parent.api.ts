import {
  CreateParentInput,
  ParentDTO,
  UpdateParentInput,
} from "@harcapp/types";
import { SupabaseClient } from "@supabase/supabase-js";

import * as Crypto from "expo-crypto";

export async function fetchUserParents(
  supabase: SupabaseClient,
  userId: string,
): Promise<ParentDTO[]> {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("User")
    .select(
      `
      parents:Parent (
        id,
        firstName,
        lastName,
        email,
        phoneNumber
      )
    `,
    )
    .eq("id", userId)
    .single();

  if (error) {
    console.error(
      `Błąd podczas pobierania rodziców użytkownika (${userId}):`,
      error,
    );
    throw error;
  }

  return (data?.parents as ParentDTO[]) ?? [];
}

export async function createParentAndLinkToUser(
  supabase: SupabaseClient,
  userId: string,
  input: CreateParentInput,
): Promise<string> {
  const parentId = Crypto.randomUUID();

  const { error: createError } = await supabase.from("Parent").insert({
    id: parentId,
    firstName: input.firstName,
    lastName: input.lastName,
    phoneNumber: input.phoneNumber ?? null,
    email: input.email ?? null,
  });

  if (createError) {
    console.error("Błąd podczas tworzenia rodzica:", createError);
    throw createError;
  }

  const { error: linkError } = await supabase.from("_UserParents").insert({
    A: parentId,
    B: userId,
  });

  if (linkError) {
    console.error("Błąd relacji rodzic-użytkownik:", linkError);
    throw linkError;
  }

  return parentId;
}

export async function updateParent(
  supabase: SupabaseClient,
  parentId: string,
  input: UpdateParentInput,
): Promise<void> {
  const { error } = await supabase
    .from("Parent")
    .update({
      ...(input.firstName && { firstName: input.firstName }),
      ...(input.lastName && { lastName: input.lastName }),
      phoneNumber: input.phoneNumber ?? null,
      email: input.email ?? null,
    })
    .eq("id", parentId);

  if (error) {
    console.error(`Błąd edycji rodzica (${parentId}):`, error);
    throw error;
  }
}

export async function deleteParent(
  supabase: SupabaseClient,
  parentId: string,
): Promise<void> {
  const { error } = await supabase.from("Parent").delete().eq("id", parentId);

  if (error) {
    console.error(`Błąd usuwania rodzica (${parentId}):`, error);
    throw error;
  }
}
