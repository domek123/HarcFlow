import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Request } from 'express';

export type AuthenticatedUser = SupabaseUser;

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};
