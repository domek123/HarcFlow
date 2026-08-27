import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import type { ScoutProfileDTO } from "@harcapp/types";
import type { Rank, Degree, Function } from "@harcapp/types";

interface RawScoutProfile {
  id: string;
  userId: string;
  rank: string;
  degree: string;
  function: string;
  user: {
    firstName: string;
    lastName: string;
    email: string | null;
    phoneNumber: string | null;
    birthDate: string | null;
    gender: "MALE" | "FEMALE";
  };
}

export function useTroopMembersList(
  supabase: SupabaseClient,
  troopId?: string,
) {
  return useQuery({
    queryKey: ["scout-troop-members", troopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ScoutProfile")
        .select<string, RawScoutProfile>(
          `
          id,
          userId,
          rank,
          degree,
          function,
          user:User!inner (
            firstName,
            lastName,
            email,
            phoneNumber,
            birthDate,
            gender
          )
        `,
        )
        .eq("troopId", troopId);

      if (error) {
        console.error("Błąd pobierania członków drużyny z Supabase:", error);
        throw error;
      }

      if (!data) return [];

      const membersList: ScoutProfileDTO[] = data.map((item) => ({
        id: item.id,
        userId: item.userId,
        firstName: item.user?.firstName ?? "",
        lastName: item.user?.lastName ?? "",
        email: item.user?.email ?? "",
        phoneNumber: item.user?.phoneNumber ?? undefined,
        birthDate: item.user?.birthDate ?? "",
        gender: item.user?.gender,
        rank: item.rank as Rank,
        degree: item.degree as Degree,
        function: item.function as Function,
      }));

      return membersList;
    },
    enabled: !!troopId,
  });
}

export function useAddMember(troopId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Omit<ScoutProfileDTO, "id">) => {
      const response = await fetch(
        "http://localhost:3000/troop-members/members",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...payload,
            troopId,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Wystąpił błąd podczas zapisywania",
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scout-troop-members", troopId],
      });
    },
  });
}

export function useDeleteTroopMember(troopId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileId: string) => {
      const response = await fetch(
        `http://localhost:3000/troop-members/${profileId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Nie udało się usunąć członka");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scout-troop-members", troopId],
      });
    },
  });
}

export function useUpdateTroopMember(troopId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: ScoutProfileDTO) => {
      const response = await fetch(
        `http://localhost:3000/troop-members/${dto.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dto),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Nie udało się zaktualizować profilu",
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scout-troop-members", troopId],
      });
    },
  });
}
