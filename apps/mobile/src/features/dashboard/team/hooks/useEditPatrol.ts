import { supabase } from "@/lib/supabase";
import { showToast } from "@/utils/toast";
import {
  useFetchCurrentScoutProfile,
  useUpdatePatrol,
} from "@harcapp/api-client";
import type { PatrolDTO } from "@harcapp/types";
import {
  UpdatePatrolFormValues,
  updatePatrolSchema,
} from "@harcapp/validators";
import { useTranslation } from "react-i18next";

export const useEditPatrol = () => {
  const { t } = useTranslation();

  const { data: currentScout } = useFetchCurrentScoutProfile(supabase);

  const { mutateAsync: updatePatrol, isPending: isUpdatingPatrol } =
    useUpdatePatrol(supabase, currentScout?.troopId);

  const submitPatrolUpdate = async (
    patrol: PatrolDTO,
    values: UpdatePatrolFormValues,
  ) => {
    const parsed = updatePatrolSchema.safeParse(values);

    if (!parsed.success) {
      const errorMessage =
        parsed.error.issues[0]?.message ??
        t("dashboard.team.editPatrolValidation.generic");

      showToast.error(errorMessage);
      return false;
    }

    try {
      await updatePatrol({
        id: patrol.id,
        name: parsed.data.name,
        assemblyDay: parsed.data.assemblyDay,
        assemblyTime: parsed.data.assemblyTime,
      });

      showToast.success(t("dashboard.team.updatePatrolSuccess"));
      return true;
    } catch {
      showToast.error(t("dashboard.team.updatePatrolError"));
      return false;
    }
  };

  return {
    isUpdatingPatrol,
    submitPatrolUpdate,
  };
};
