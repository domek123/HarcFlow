export type LoginFormValues = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
};
