import { SupabaseClient } from "@supabase/supabase-js";
import { ChildContactDTO, ParentContactDTO } from "@harcapp/types";

export async function fetchChildrenContacts(
  supabase: SupabaseClient,
  troopId: string,
): Promise<ChildContactDTO[]> {
  if (!troopId) {
    return [];
  }

  const { data, error } = await supabase
    .from("ScoutProfile")
    .select<string, { user: ChildContactDTO }>(
      `
      user:User!inner (
        id,
        firstName,
        lastName,
        phoneNumber,
        email
      )
    `,
    )
    .eq("troopId", troopId)
    .order("userId");

  if (error) {
    throw error;
  }

  return (data ?? []).map(({ user }) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    email: user.email,
  }));
}

export async function fetchParentsContacts(
  supabase: SupabaseClient,
  troopId: string,
): Promise<ParentContactDTO[]> {
  if (!troopId) {
    return [];
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("ScoutProfile")
    .select("userId")
    .eq("troopId", troopId);

  if (profilesError) {
    throw profilesError;
  }

  const userIds = (profiles ?? [])
    .map((profile) => profile.userId)
    .filter((userId): userId is string => Boolean(userId));

  if (userIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("Parent")
    .select(
      `
      id,
      firstName,
      lastName,
      phoneNumber,
      email,
      children:User!inner (
        id
      )
    `,
    )
    .in("children.id", userIds);

  if (error) {
    throw error;
  }

  const currentTroopChildren = new Set(userIds);
  const uniqueParents = new Map<string, ParentContactDTO>();

  for (const parent of data ?? []) {
    const uniqueParent = uniqueParents.get(parent.id) ?? {
      id: parent.id,
      firstName: parent.firstName,
      lastName: parent.lastName,
      phoneNumber: parent.phoneNumber,
      email: parent.email,
      children: [],
    };

    uniqueParents.set(parent.id, uniqueParent);
  }

  return Array.from(uniqueParents.values());
}
