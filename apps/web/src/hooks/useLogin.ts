import { useState } from 'react';

import { supabase } from "@/lib/supabase.ts";

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    error,
    loading,
  };
};
