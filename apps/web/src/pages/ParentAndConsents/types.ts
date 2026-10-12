export interface ChildContact {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  email: string | null;
}

export interface ParentContact {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  email: string | null;
  children: {
    id: string;
    firstName: string;
    lastName: string;
  }[];
}

export type EmailMode = "to" | "bcc";
