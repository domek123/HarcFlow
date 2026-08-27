import { type ReactNode, useState, useEffect } from "react";

import { Navigate, useLocation } from "react-router-dom";

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

interface AuthRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const DefaultLoader = (
  <div className="flex h-screen items-center justify-center">Ładowanie...</div>
);

export function ProtectedRoute({
  children,
  fallback = DefaultLoader,
}: AuthRouteProps) {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <>{fallback}</>;

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function PublicOnlyRoute({
  children,
  fallback = DefaultLoader,
}: AuthRouteProps) {
  const { session, isLoading } = useAuth();

  if (isLoading) return <>{fallback}</>;

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export function NotFoundRedirect() {
  const { session, isLoading } = useAuth();

  if (isLoading) return null;

  return <Navigate to={session ? "/dashboard" : "/login"} replace />;
}
