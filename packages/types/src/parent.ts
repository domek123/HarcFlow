export type ParentDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type CreateParentInput = Omit<ParentDTO, "id">;
export type UpdateParentInput = Partial<CreateParentInput>;
