import { z } from 'zod';

export const createTroopSchema = z.object({
  name: z.string().min(3, 'Nazwa musi mieć min. 3 znaki'),
  description: z.string().optional(),
});

export type CreateTroopInput = z.infer<typeof createTroopSchema>;

export const defaultValues = {
  name: '',
  description: '',
}