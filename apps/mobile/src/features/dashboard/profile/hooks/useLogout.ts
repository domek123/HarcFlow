import { useState } from "react";

import { useTranslation } from "react-i18next";

import { supabase } from "@/lib/supabase";
import { showToast } from "@/utils/toast";

export function useLogout() {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signOut();

    setIsLoading(false);

    if (error) {
      setError(error);
      return {
        success: false,
        error,
      };
    }

    showToast.success(t("profile.logoutSuccess"));

    return {
      success: true,
    };
  };

  return {
    logout,
    isLoading,
    error,
  };
}
