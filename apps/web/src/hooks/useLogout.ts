import { useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/lib/supabase";

export const useLogout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      navigate("/login");
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
      setLogoutError(
        t("dashboard.logoutError", { message: (error as Error).message }),
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { handleLogout, isLoggingOut, logoutError };
};
