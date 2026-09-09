import { useState } from "react";

import { useTranslation } from "react-i18next";

import { supabase } from "@/lib/supabase";
import { showToast } from "@/utils/toast";
import {
  useCreatePatrol,
  useFetchCurrentScoutProfile,
} from "@harcapp/api-client";

export function useAddPatrol() {
  const { t } = useTranslation();

  const { mutateAsync: addPatrol, isPending: isAddingPatrol } =
    useCreatePatrol(supabase);

  const { data: currentScout } = useFetchCurrentScoutProfile(supabase);

  const [patrolName, setPatrolName] = useState("");

  const handleAddPatrol = async (closeModal: () => void) => {
    const name = patrolName.trim();
    if (!name || !currentScout?.troopId) {
      if (!name) setPatrolName("");
      return;
    }

    try {
      await addPatrol({ name, troopId: currentScout.troopId! });
      showToast.success(t("dashboard.team.addPatrolSuccess"));
      closeModal();
      setPatrolName("");
    } catch {
      showToast.error(t("dashboard.team.addPatrolError"));
    }
  };

  return {
    patrolName,
    setPatrolName,
    handleAddPatrol,
    isAddingPatrol,
  };
}
