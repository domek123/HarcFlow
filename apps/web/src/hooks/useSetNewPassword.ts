import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

export function useSetNewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasRecoverySession(Boolean(session));
      setCheckingSession(false);
    });
  }, []);

  const handleSetNewPassword = async () => {
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("passwordsDoNotMatch");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      await supabase.auth.signOut();
      setSuccess(true);
    }

    setLoading(false);
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    hasRecoverySession,
    checkingSession,
    handleSetNewPassword,
    error,
    success,
    loading,
  };
}
