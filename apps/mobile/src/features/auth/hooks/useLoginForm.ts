import { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { supabase } from "@/lib/supabase";

import type { LoginFormValues } from "../types/auth.types";

export function useLoginForm() {
  const { t } = useTranslation();

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().trim().email(t("auth.validation.email")),
        password: z.string().min(6, t("auth.validation.password")),
      }),
    [t],
  );

  const form = useForm<LoginFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const onSubmit = form.handleSubmit(async (values) => {
    setAuthError(null);

    try {
      await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nie udało się zalogować. Sprawdź dane logowania.";

      setAuthError(message);
    }
  });

  return {
    control: form.control,
    errors: form.formState.errors,
    isLoading: form.formState.isSubmitting,
    authError,
    isPasswordVisible,
    togglePasswordVisibility: () => setIsPasswordVisible((value) => !value),
    onSubmit,
  };
}
