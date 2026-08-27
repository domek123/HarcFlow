import { useState, useEffect } from "react";

import { Navigate, Outlet, useLocation } from "react-router-dom";

import { supabase } from "./supabase";

import type { Session } from "@supabase/supabase-js";

function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, isLoading };
}

const DefaultLoader = (
  <div className="flex h-screen items-center justify-center">Ładowanie...</div>
);

export function ProtectedLayout() {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return DefaultLoader;
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export function PublicOnlyLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return DefaultLoader;
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export function NotFoundRedirect() {
  const { session, isLoading } = useAuth();

  if (isLoading) return null;

  return <Navigate to={session ? "/dashboard" : "/login"} replace />;
}
